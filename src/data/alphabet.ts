// 老挝语辅音表 (27个)
export interface LaoConsonant {
  char: string;        // 老挝字母
  name: string;        // 字母名称
  pinyin: string;      // 中文近似音
  sound: string;       // 声母发音
  class: 'high' | 'mid' | 'low'; // 声调类别
  meaning: string;     // 名称含义（动物/事物）
  example: string;     // 示例单词
  exampleMeaning: string; // 示例含义
}

export const consonants: LaoConsonant[] = [
  // 中辅音 (Mid Class) - 9个
  { char: 'ກ', name: 'ກ ໄກ่', pinyin: 'gō', sound: 'g/k', class: 'mid', meaning: '鸡', example: 'ກາ', exampleMeaning: '乌鸦' },
  { char: 'ຈ', name: 'ຈ ຈาน', pinyin: 'jān', sound: 'j', class: 'mid', meaning: '盘子', example: 'ຈາ', exampleMeaning: '姑妈' },
  { char: 'ດ', name: 'ດ ເດັກ', pinyin: 'dèk', sound: 'd', class: 'mid', meaning: '小孩', example: 'ດອກ', exampleMeaning: '花' },
  { char: 'ຕ', name: 'ຕ ຕາ', pinyin: 'tā', sound: 't', class: 'mid', meaning: '眼睛', example: 'ຕາ', exampleMeaning: '眼睛' },
  { char: 'ບ', name: 'ບ ແບ້', pinyin: 'bè', sound: 'b', class: 'mid', meaning: '山羊', example: 'ບາ', exampleMeaning: '鱼' },
  { char: 'ປ', name: 'ປ ປາ', pinyin: 'bā', sound: 'p', class: 'mid', meaning: '鱼', example: 'ປາ', exampleMeaning: '鱼' },
  { char: 'ອ', name: 'ອ ອິງ', pinyin: 'īng', sound: '无声母', class: 'mid', meaning: '猴子', example: 'ອາກາດ', exampleMeaning: '天气' },
  { char: 'ຮ', name: 'ຮ ເຮືອນ', pinyin: 'hǔan', sound: 'h', class: 'mid', meaning: '房子', example: 'ຮ້ານ', exampleMeaning: '店' },

  // 高辅音 (High Class) - 9个
  { char: 'ຂ', name: 'ຂ ໄຂ່', pinyin: 'kài', sound: 'kh', class: 'high', meaning: '蛋', example: 'ຂາ', exampleMeaning: '腿' },
  { char: 'ສ', name: 'ສ ເສືອ', pinyin: 'sǔa', sound: 's', class: 'high', meaning: '老虎', example: 'ສາ', exampleMeaning: '绳子' },
  { char: 'ຖ', name: 'ຖ ຖົງ', pinyin: 'tǒng', sound: 'th', class: 'high', meaning: '袋子', example: 'ຖາ', exampleMeaning: '问' },
  { char: 'ຜ', name: 'ຜ ເຜິ້ງ', pinyin: 'pêng', sound: 'ph', class: 'high', meaning: '蜜蜂', example: 'ຜັກ', exampleMeaning: '蔬菜' },
  { char: 'ຝ', name: 'ຝ ຝາ', pinyin: 'fā', sound: 'f', class: 'high', meaning: '墙壁', example: 'ຝາ', exampleMeaning: '墙壁' },
  { char: 'ພ', name: 'ພ ພູ', pinyin: 'pū', sound: 'ph', class: 'high', meaning: '山', example: 'ພາ', exampleMeaning: '带(人)' },
  { char: 'ຟ', name: 'ຟ ໄຟ', pinyin: 'fái', sound: 'f', class: 'high', meaning: '火', example: 'ຟາ', exampleMeaning: '天盖' },
  { char: 'ຫ', name: 'ຫ ຫ່ານ', pinyin: 'hàn', sound: 'h', class: 'high', meaning: '鹅', example: 'ຫາ', exampleMeaning: '找' },
  { char: 'ລ', name: 'ລ ລີງ', pinyin: 'līng', sound: 'l', class: 'high', meaning: '猿猴', example: 'ລາ', exampleMeaning: '辞别' },

  // 低辅音 (Low Class) - 9个
  { char: 'ຄ', name: 'ຄ ຄວາຍ', pinyin: 'kuāi', sound: 'kh', class: 'low', meaning: '水牛', example: 'ຄາ', exampleMeaning: '下颚' },
  { char: 'ຊ', name: 'ຊ ຊ້າງ', pinyin: 'sàng', sound: 's/z', class: 'low', meaning: '大象', example: 'ຊາ', exampleMeaning: '茶' },
  { char: 'ນ', name: 'ນ ນົກ', pinyin: 'nók', sound: 'n', class: 'low', meaning: '鸟', example: 'ນາ', exampleMeaning: '田' },
  { char: 'ມ', name: 'ມ ແມວ', pinyin: 'mèo', sound: 'm', class: 'low', meaning: '猫', example: 'ມາ', exampleMeaning: '来' },
  { char: 'ຢ', name: 'ຢ ຢາ', pinyin: 'yā', sound: 'y', class: 'low', meaning: '药', example: 'ຢາ', exampleMeaning: '药' },
  { char: 'ວ', name: 'ວ ວີ', pinyin: 'wī', sound: 'w/v', class: 'low', meaning: '扇子', example: 'ວາ', exampleMeaning: '放' },
  { char: 'ຍ', name: 'ຍ ຍຸງ', pinyin: 'yūng', sound: 'y/ny', class: 'low', meaning: '蚊子', example: 'ຍາ', exampleMeaning: '困难' },
  { char: 'ທ', name: 'ທ ທຸງ', pinyin: 'tūng', sound: 'th', class: 'low', meaning: '旗', example: 'ທາ', exampleMeaning: '涂' },
  { char: 'ດ', name: 'ດ ເດັກ', pinyin: 'dèk', sound: 'd', class: 'mid', meaning: '小孩', example: 'ດອກ', exampleMeaning: '花' },
];

// 声调符号
export interface ToneMark {
  mark: string;
  name: string;
  effect: string;
  pinyin: string;
}

export const toneMarks: ToneMark[] = [
  { mark: '່', name: 'ไม้เอก', effect: '第2声调', pinyin: 'mai ek' },
  { mark: '້', name: 'ไม้โท', effect: '第3声调', pinyin: 'mai tho' },
  { mark: '໊', name: 'ไม้ตรี', effect: '第4声调', pinyin: 'mai tri' },
  { mark: '໋', name: 'ไม้จัตวา', effect: '第5声调', pinyin: 'mai jattawa' },
];

// 老挝语声调 (6个)
export interface LaoTone {
  name: string;
  pinyin: string;
  description: string;
  example: string;
  exampleMeaning: string;
  pattern: string; // 声调走向
}

export const tones: LaoTone[] = [
  { name: 'สามัญ', pinyin: 'sam', description: '中平调（第1声）', example: 'ກາ', exampleMeaning: '乌鸦', pattern: '→' },
  { name: 'เอก', pinyin: 'ek', description: '低降调（第2声）', example: 'ກ່າ', exampleMeaning: '过', pattern: '↘' },
  { name: 'โท', pinyin: 'tho', description: '高降调（第3声）', example: 'ກ້າ', exampleMeaning: '勇敢', pattern: '↘' },
  { name: 'ตรี', pinyin: 'tri', description: '高平调（第4声）', example: 'ກ໊າ', exampleMeaning: '(无)', pattern: '→' },
  { name: 'จัตวา', pinyin: 'jattawa', description: '升调（第5声）', example: 'ກ໋າ', exampleMeaning: '(无)', pattern: '↗' },
  { name: 'อื่นๆ', pinyin: 'other', description: '特殊声调组合', example: 'ກັດ', exampleMeaning: '咬', pattern: '→' },
];
