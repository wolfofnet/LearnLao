#!/usr/bin/env python3
"""
Generate Lao TTS audio files using edge-tts.
Extracts Lao text from data files and scenario definitions only.
"""
import asyncio
import os
import re
import hashlib
import json

import edge_tts

VOICE = "lo-LA-ChanthavongNeural"
SLOW_VOICE = "lo-LA-KeomanyNeural"
OUTPUT_DIR = "public/audio"
RATE_NORMAL = "+0%"
RATE_SLOW = "-40%"

def extract_lao_from_data_files():
    """Extract Lao text from data files (alphabet, vocabulary, dialogues)."""
    lao_texts = set()
    
    data_files = [
        "src/data/alphabet.ts",
        "src/data/vocabulary.ts",
        "src/data/dialogues.ts",
    ]
    
    for filepath in data_files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        # Find single-quoted strings with Lao characters
        for match in re.finditer(r"'([^']*[\u0E80-\u0EFF][^']*)'", content):
            text = match.group(1).strip()
            if text and len(text) > 1:  # Skip single chars that are just diacritics
                lao_texts.add(text)
    
    return lao_texts

def extract_lao_from_scenarios():
    """Extract Lao text from ScenarioPage.tsx scenario definitions."""
    lao_texts = set()
    filepath = "src/pages/ScenarioPage.tsx"
    if not os.path.exists(filepath):
        return lao_texts
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find lao: 'xxx' patterns
    for match in re.finditer(r"lao:\s*'([^']+)'", content):
        text = match.group(1).strip()
        if text:
            lao_texts.add(text)
    
    return lao_texts

def extract_lao_from_pages():
    """Extract hardcoded Lao strings from page components."""
    lao_texts = set()
    pages_dir = "src/pages"
    
    for filename in os.listdir(pages_dir):
        if not filename.endswith('.tsx'):
            continue
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find speakLao('xxx') calls
        for match in re.finditer(r"speakLao\('([^']+)'\)", content):
            text = match.group(1).strip()
            if text:
                lao_texts.add(text)
        
        # Find speakSlow('xxx') calls
        for match in re.finditer(r"speakSlow\('([^']+)'\)", content):
            text = match.group(1).strip()
            if text:
                lao_texts.add(text)
    
    return lao_texts

def text_to_filename(text, rate=RATE_NORMAL):
    """Generate a stable filename from Lao text."""
    content = f"{text}|{rate}"
    h = hashlib.md5(content.encode('utf-8')).hexdigest()[:12]
    # Clean text for readable prefix - use unicode codepoints safe for filenames
    clean = re.sub(r'[^\w]', '_', text[:20]).strip('_')
    if not clean:
        clean = "lao"
    return f"{clean}_{h}.mp3"

async def generate_audio(text, output_path, voice=VOICE, rate=RATE_NORMAL):
    """Generate a single audio file."""
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(output_path)
        return True
    except Exception as e:
        print(f"  SKIP: '{text[:30]}' -> {e}")
        return False

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs("src", exist_ok=True)
    
    # Extract all Lao texts from different sources
    texts = set()
    texts.update(extract_lao_from_data_files())
    texts.update(extract_lao_from_scenarios())
    texts.update(extract_lao_from_pages())
    
    # Filter out standalone diacritics (tone marks alone can't be spoken)
    texts = {t for t in texts if len(t.strip()) > 1 and not re.match(r'^[\u0EC0-\u0ECF]+$', t.strip())}
    
    texts = sorted(texts)
    print(f"Found {len(texts)} unique Lao text strings")
    
    # Generate mapping and tasks
    mapping = {}
    tasks = []
    
    for text in texts:
        filename = text_to_filename(text, RATE_NORMAL)
        filepath = os.path.join(OUTPUT_DIR, filename)
        mapping[text] = {"normal": f"/audio/{filename}"}
        if not os.path.exists(filepath) or os.path.getsize(filepath) < 100:
            tasks.append((text, filepath, VOICE, RATE_NORMAL))
        
        filename_slow = text_to_filename(text, RATE_SLOW)
        filepath_slow = os.path.join(OUTPUT_DIR, filename_slow)
        mapping[text]["slow"] = f"/audio/{filename_slow}"
        if not os.path.exists(filepath_slow) or os.path.getsize(filepath_slow) < 100:
            tasks.append((text, filepath_slow, SLOW_VOICE, RATE_SLOW))
    
    print(f"Need to generate {len(tasks)} audio files")
    
    batch_size = 5
    failed = set()
    
    for i in range(0, len(tasks), batch_size):
        batch = tasks[i:i+batch_size]
        coros = [generate_audio(t, p, v, r) for t, p, v, r in batch]
        results = await asyncio.gather(*coros)
        for (t, p, v, r), ok in zip(batch, results):
            if not ok:
                failed.add(t)
        print(f"  Generated {min(i+batch_size, len(tasks))}/{len(tasks)}")
        if i + batch_size < len(tasks):
            await asyncio.sleep(0.5)
    
    # Remove failed entries
    for t in failed:
        mapping.pop(t, None)
    
    # Write mapping
    mapping_path = os.path.join("src", "audio-map.json")
    with open(mapping_path, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, ensure_ascii=False, indent=2)
    
    print(f"\nDone! Audio files in: {OUTPUT_DIR}/")
    print(f"Mapping: {mapping_path} ({len(mapping)} entries)")
    if failed:
        print(f"Failed ({len(failed)}): skipped {len(failed)} texts")

if __name__ == "__main__":
    asyncio.run(main())
