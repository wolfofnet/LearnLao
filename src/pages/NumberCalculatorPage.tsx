import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface Props {
  goBack: () => void;
}

// 老挝语数字
const laoDigits: Record<string, string> = {
  '0': 'ສູນ', '1': 'ໜຶ່ງ', '2': 'ສອງ', '3': 'ສາມ', '4': 'ສີ່',
  '5': 'ຫ້າ', '6': 'ຫົກ', '7': 'ເຈັດ', '8': 'ແປດ', '9': 'ເກົ້າ',
};

// 运算符老挝语
const laoOperators: Record<string, string> = {
  '+': 'ບວກ', '-': 'ລົບ', '×': 'ຄູນ', '÷': 'ແບ່ງ', '=': 'ເທົ່າກັບ',
};

function numberToLao(num: number): string {
  if (num === 0) return laoDigits['0'];
  if (num < 0) return 'ລົບ ' + numberToLao(-num);
  const str = num.toString();
  const len = str.length;
  if (len === 1) return laoDigits[str];
  if (len === 2) {
    const tens = str[0], ones = str[1];
    if (tens === '1') return ones === '0' ? 'ສິບ' : 'ສິບ ' + laoDigits[ones];
    if (tens === '2') return ones === '0' ? 'ຊາວ' : 'ຊາວ ' + laoDigits[ones];
    return laoDigits[tens] + ' ສິບ' + (ones === '0' ? '' : ' ' + laoDigits[ones]);
  }
  if (len === 3) {
    const h = str[0], rest = parseInt(str.substring(1));
    return laoDigits[h] + ' ຮ້ອຍ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
  }
  if (len === 4) {
    const t = str[0], rest = parseInt(str.substring(1));
    return laoDigits[t] + ' ພັນ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
  }
  if (len === 5) {
    const tt = str[0], rest = parseInt(str.substring(1));
    if (tt === '1') return 'ສິບ ພັນ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
    if (tt === '2') return 'ຊາວ ພັນ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
    return laoDigits[tt] + ' ສິບ ພັນ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
  }
  if (len === 6) {
    const h = str[0], rest = parseInt(str.substring(1));
    return laoDigits[h] + ' ແສນ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
  }
  if (len >= 7) {
    const m = parseInt(str.substring(0, len - 6)), rest = parseInt(str.substring(len - 6));
    return numberToLao(m) + ' ລ້ານ' + (rest === 0 ? '' : ' ' + numberToLao(rest));
  }
  return str;
}

function safeEval(expr: string): number | null {
  try {
    const s = expr.replace(/×/g, '*').replace(/÷/g, '/');
    if (!/^[\d+\-*/().%\s]+$/.test(s)) return null;
    const r = Function('"use strict";return (' + s + ')')();
    return typeof r === 'number' && isFinite(r) ? r : null;
  } catch { return null; }
}

// 汇率
const RATES = { kip: 1, cny: 2500, usd: 21000, thb: 650 };
type Currency = 'kip' | 'cny' | 'usd' | 'thb';
const CURRENCY_LABELS: Record<Currency, string> = { kip: '₭ 基普', cny: '¥ 人民币', usd: '$ 美元', thb: '฿ 泰铢' };
const CURRENCY_FLAGS: Record<Currency, string> = { kip: '🇱🇦', cny: '🇨🇳', usd: '🇺🇸', thb: '🇹🇭' };

// ======== 数据定义 ========
type Item = { cn: string; lao: string; pinyin: string };

const CROPS: Item[] = [
  { cn: '芒果', lao: 'ໝາກມ່ວງ', pinyin: 'mak muang' },
  { cn: '红薯', lao: 'ມັນ', pinyin: 'man' },
  { cn: '黄瓜', lao: 'ແຕງ', pinyin: 'taeng' },
  { cn: '西瓜', lao: 'ໝາກໂມ', pinyin: 'mak mo' },
  { cn: '水稻', lao: 'ເຂົ້າ', pinyin: 'khao' },
  { cn: '玉米', lao: 'ໝາກສາລີ', pinyin: 'mak sali' },
  { cn: '香蕉', lao: 'ໝາກກ້ວຍ', pinyin: 'mak kuai' },
  { cn: '木薯', lao: 'ມັນຕົ້ນ', pinyin: 'man ton' },
];

const FARM_SENTENCES: Item[] = [
  { lao: 'ປູກໝາກມ່ວງ', cn: '种芒果', pinyin: 'pouk mak muang' },
  { lao: 'ປູກມັນ', cn: '种红薯', pinyin: 'pouk man' },
  { lao: 'ປູກແຕງ', cn: '种黄瓜', pinyin: 'pouk taeng' },
  { lao: 'ປູກໝາກໂມ', cn: '种西瓜', pinyin: 'pouk mak mo' },
  { lao: 'ເກັບໝາກມ່ວງ', cn: '收芒果', pinyin: 'kaeb mak muang' },
  { lao: 'ເກັບມັນ', cn: '收红薯', pinyin: 'kaeb man' },
  { lao: 'ເກັບແຕງ', cn: '收黄瓜', pinyin: 'kaeb taeng' },
  { lao: 'ເກັບໝາກໂມ', cn: '收西瓜', pinyin: 'kaeb mak mo' },
  { lao: 'ຫົດນ້ຳ', cn: '浇水', pinyin: 'hot nam' },
  { lao: 'ໃສ່ປຸ໋ຍ', cn: '施肥', pinyin: 'sai pui' },
  { lao: 'ຖາງຫຍ້າ', cn: '除草', pinyin: 'thang nya' },
];

const PROCESSING: Item[] = [
  { lao: 'ເຮັດແປ້ງມັນ', cn: '做红薯粉', pinyin: 'het paeng man' },
  { lao: 'ລ້າງມັນ', cn: '洗红薯', pinyin: 'lang man' },
  { lao: 'ປົ່ນມັນ', cn: '磨碎', pinyin: 'pon man' },
  { lao: 'ກອງແປ້ງ', cn: '过滤淀粉', pinyin: 'kong paeng' },
  { lao: 'ຕົ້ມມັນ', cn: '煮/蒸', pinyin: 'tom man' },
  { lao: 'ຕາກແຫ້ງ', cn: '晾干', pinyin: 'tak haeng' },
  { lao: 'ເອົາມັນຂຶ້ນລົດ', cn: '把红薯装车', pinyin: 'ao man khuen lot' },
];

const WORKER: Item[] = [
  { lao: 'ມື້ນີ້ເຮັດຫຍັງ?', cn: '今天干什么？', pinyin: 'mui ni het nyang?' },
  { lao: 'ເອົາລົດມາ', cn: '把车开过来', pinyin: 'ao lot ma' },
  { lao: 'ລົດເສຍ', cn: '车坏了', pinyin: 'lot sia' },
  { lao: 'ສ້ອມແປງລົດ', cn: '修车', pinyin: 'sompaeng lot' },
  { lao: 'ເປີດນ້ຳ', cn: '开水泵', pinyin: 'poet nam' },
  { lao: 'ປິດນ້ຳ', cn: '关水', pinyin: 'pit nam' },
  { lao: 'ເປີດເຄື່ອງ', cn: '开机器', pinyin: 'poet khueang' },
  { lao: 'ປິດເຄື່ອງ', cn: '关机器', pinyin: 'pit khueang' },
  { lao: 'ມື້ອື່ນມາແຕ່ເຊົ້າ', cn: '明天早上来', pinyin: 'mui un ma tae sao' },
  { lao: 'ພັກຜ່ອນກ່ອນ', cn: '先休息', pinyin: 'pak phon kon' },
  { lao: 'ເຮັດໃຫ້ແລ້ວ', cn: '做完它', pinyin: 'het hai laew' },
  { lao: 'ເຮັດໄວໆ', cn: '做快点', pinyin: 'het vai vai' },
  { lao: 'ເຮັດຊ້າໆ', cn: '做慢点', pinyin: 'het sa sa' },
  { lao: 'ລະວັດແດ່', cn: '小心点', pinyin: 'lavat dae' },
  { lao: 'ຂົນຂຶ້ນລົດ', cn: '搬上车', pinyin: 'khon khuen lot' },
  { lao: 'ລົງຂອງ', cn: '卸货', pinyin: 'long khong' },
  { lao: 'ມື້ນີ້ຈ່າຍເງິນ', cn: '今天发工资', pinyin: 'mui ni chai ngoen' },
  { lao: 'ຄ່າແຮງງານເທົ່າໃດ?', cn: '工钱多少？', pinyin: 'kha haeng ngan thao dai?' },
  { lao: 'ຕ້ອງການຄົນ', cn: '需要人', pinyin: 'tongkan khon' },
  { lao: 'ຂາດຄົນ', cn: '缺人', pinyin: 'khat khon' },
  { lao: 'ມີຄົນຈັກຄົນ?', cn: '有几个人？', pinyin: 'mi khon jak khon?' },
  { lao: 'ມາເຕັມ', cn: '全来了', pinyin: 'ma tem' },
];

const SELLING: Item[] = [
  { lao: 'ໝາກມ່ວງກິໂລລະເທົ່າໃດ?', cn: '芒果多少钱一公斤？', pinyin: 'mak muang ki lo la thao dai?' },
  { lao: 'ຊື້ທັງໝົດ', cn: '全买了', pinyin: 'sue thang mot' },
  { lao: 'ຂາຍຍົກ', cn: '批发', pinyin: 'khai yok' },
  { lao: 'ຂາຍຍ່ອຍ', cn: '零售', pinyin: 'khai noi' },
  { lao: 'ລົດມາແລ້ວ', cn: '车来了', pinyin: 'lot ma laew' },
  { lao: 'ຕັດແຕງ', cn: '摘黄瓜', pinyin: 'tat taeng' },
  { lao: 'ເກັບຜົນ', cn: '收获', pinyin: 'kaeb phon' },
];

const COOKING: Item[] = [
  { lao: 'ເຮັດກິນ', cn: '做饭', pinyin: 'het kin' },
  { lao: 'ຕົ້ມ', cn: '煮', pinyin: 'tom' },
  { lao: 'ຜັດ', cn: '炒', pinyin: 'phat' },
  { lao: 'ປິງ', cn: '烤', pinyin: 'ping' },
  { lao: 'ຕຳ', cn: '舂/凉拌', pinyin: 'tam' },
  { lao: 'ລວກ', cn: '烫/焯', pinyin: 'luak' },
  { lao: 'ຈືນ', cn: '炸', pinyin: 'chuen' },
  { lao: 'ຫຸງ', cn: '蒸', pinyin: 'hung' },
  { lao: 'ເກືອ', cn: '盐', pinyin: 'kao' },
  { lao: 'ນ້ຳປາ', cn: '鱼露', pinyin: 'nam pa' },
  { lao: 'ນ້ຳຕານ', cn: '糖', pinyin: 'nam tan' },
  { lao: 'ໝາກເຜັດ', cn: '辣椒', pinyin: 'mak phet' },
  { lao: 'ກະທຽມ', cn: '大蒜', pinyin: 'kathiam' },
  { lao: 'ຫອມ', cn: '香菜/葱', pinyin: 'hom' },
  { lao: 'ປາ', cn: '鱼', pinyin: 'pa' },
  { lao: 'ໝູ', cn: '猪', pinyin: 'mu' },
  { lao: 'ໄກ່', cn: '鸡', pinyin: 'kai' },
  { lao: 'ຜັກ', cn: '蔬菜', pinyin: 'phak' },
  { lao: 'ໝາກໄມ້', cn: '水果', pinyin: 'mak mai' },
  { lao: 'ເຂົ້າໜຽວ', cn: '糯米饭', pinyin: 'khao niao' },
  { lao: 'ເຂົ້າຈ້າວ', cn: '米饭', pinyin: 'khao chao' },
  { lao: 'ແກງ', cn: '汤', pinyin: 'kaeng' },
  { lao: 'ຍຳ', cn: '凉拌沙拉', pinyin: 'yam' },
  { lao: 'ສົ້ມ', cn: '酸', pinyin: 'som' },
  { lao: 'ຫວານ', cn: '甜', pinyin: 'hwan' },
  { lao: 'ເຄັມ', cn: '咸', pinyin: 'khem' },
  { lao: 'ຂົມ', cn: '苦', pinyin: 'khom' },
  { lao: 'ເຜັດ', cn: '辣', pinyin: 'phet' },
  { lao: 'ອົມ', cn: '饿了', pinyin: 'om' },
  { lao: 'ກິນເຂົ້າ', cn: '吃饭', pinyin: 'kin khao' },
  { lao: 'ກິນນ້ຳ', cn: '喝水', pinyin: 'kin nam' },
  { lao: 'ເບຍ', cn: '啤酒', pinyin: 'bia' },
  { lao: 'ນ້ຳກ້ອນ', cn: '冰块', pinyin: 'nam kon' },
];

const COLORS: Item[] = [
  { cn: '红色', lao: 'ສີແດງ', pinyin: 'si daeng' },
  { cn: '绿色', lao: 'ສີຂຽວ', pinyin: 'si khiao' },
  { cn: '蓝色', lao: 'ສີຟ້າ', pinyin: 'si fa' },
  { cn: '黄色', lao: 'ສີເຫຼືອງ', pinyin: 'si lueang' },
  { cn: '白色', lao: 'ສີຂາວ', pinyin: 'si khao' },
  { cn: '黑色', lao: 'ສີດຳ', pinyin: 'si dam' },
  { cn: '橙色', lao: 'ສີສົ້ມ', pinyin: 'si som' },
  { cn: '紫色', lao: 'ສີມ່ວງ', pinyin: 'si muang' },
  { cn: '粉色', lao: 'ສີບົວ', pinyin: 'si bua' },
  { cn: '灰色', lao: 'ສີເທົາ', pinyin: 'si thao' },
  { cn: '棕色', lao: 'ສີນ້ຳຕານ', pinyin: 'si nam tan' },
  { cn: '金色', lao: 'ສີຄຳ', pinyin: 'si kham' },
  { cn: '银色', lao: 'ສີເງິນ', pinyin: 'si ngoen' },
  { cn: '深色', lao: 'ສີເຂັ້ມ', pinyin: 'si khem' },
  { cn: '浅色', lao: 'ສີອ່ອນ', pinyin: 'si on' },
];

const PHRASES: Item[] = [
  { lao: 'ລາຄາ ເທົ່າໃດ?', cn: '多少钱？', pinyin: 'laka thao dai?' },
  { lao: 'ຖືກກວ່າໄດ້ບໍ່?', cn: '能便宜吗？', pinyin: 'thuek kwa dai bo?' },
  { lao: 'ຫຼຸດໃຫ້ແດ່', cn: '给个折扣', pinyin: 'lut hai dae' },
  { lao: 'ລາຄາສຸດທ້າຍ', cn: '最终价格', pinyin: 'laka sut thai' },
  { lao: 'ໝາກມ່ວງກິໂລລະເທົ່າໃດ?', cn: '芒果多少钱一公斤？', pinyin: 'mak muang ki lo la thao dai?' },
  { lao: 'ຊື້ທັງໝົດ', cn: '全买了', pinyin: 'sue thang mot' },
];

// 量词
const UNITS: Item[] = [
  { cn: '个', lao: 'ອັນ', pinyin: 'an' },
  { cn: '只/头', lao: 'ໂຕ', pinyin: 'tou' },
  { cn: '条', lao: 'ເສັ້ນ', pinyin: 'sen' },
  { cn: '件', lao: 'ຊິ້ນ', pinyin: 'sin' },
  { cn: '框', lao: 'ກ່ອງ', pinyin: 'kong' },
  { cn: '袋', lao: 'ຖົງ', pinyin: 'thong' },
  { cn: '瓶', lao: 'ແກ້ວ', pinyin: 'kaew' },
  { cn: '包', lao: 'ແພັກ', pinyin: 'paek' },
  { cn: '公斤', lao: 'ກິໂລ', pinyin: 'ki lo' },
  { cn: '克', lao: 'ກຣາມ', pinyin: 'gram' },
  { cn: '升', lao: 'ລິດ', pinyin: 'lit' },
  { cn: '米', lao: 'ແມັດ', pinyin: 'mat' },
  { cn: '棵', lao: 'ຕົ້ນ', pinyin: 'ton' },
  { cn: '双', lao: 'ຄູ່', pinyin: 'khou' },
  { cn: '套', lao: 'ຊຸດ', pinyin: 'soud' },
  { cn: '把', lao: 'ດັມ', pinyin: 'dam' },
];

// ======== 通用列表组件 ========
function WordList({ items, color, speakLao, speakSlow, isSpeaking }: {
  items: Item[]; color: string;
  speakLao: (t: string, r?: number) => void; speakSlow: (t: string) => void; isSpeaking: boolean;
}) {
  return (
    <div className="space-y-1">
      {items.map((p, i) => (
        <div key={i} className="flex items-center justify-between py-1.5 px-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-800 dark:text-white">{p.cn}</span>
            <span className={`lao-text text-xs ${color} ml-2`}>{p.lao}</span>
            <span className="text-[9px] text-gray-400 ml-1">{p.pinyin}</span>
          </div>
          <div className="flex gap-1 ml-1 flex-shrink-0">
            <button onClick={() => speakLao(p.lao, 1.3)} disabled={isSpeaking}
              className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 text-xs active:scale-90">🔊</button>
            <button onClick={() => speakSlow(p.lao)} disabled={isSpeaking}
              className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 text-xs active:scale-90">🐢</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function GridWords({ items, bgColor, speakLao, isSpeaking }: {
  items: Item[]; bgColor: string;
  speakLao: (t: string, r?: number) => void; isSpeaking: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {items.map((c, i) => (
        <button key={i} onClick={() => speakLao(c.lao, 1.3)} disabled={isSpeaking}
          className={`flex flex-col items-center py-2 ${bgColor} rounded-xl hover:brightness-95 transition-all active:scale-95`}>
          <span className="text-sm font-bold text-gray-800 dark:text-white">{c.cn}</span>
          <span className="lao-text text-[10px] text-gray-600 dark:text-gray-300 font-medium">{c.lao}</span>
        </button>
      ))}
    </div>
  );
}

// ======== 标签定义 ========
type TabKey = 'calc' | 'farm' | 'cook' | 'business' | 'color';
const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: 'calc', icon: '🧮', label: '计算器' },
  { key: 'farm', icon: '🌱', label: '农场' },
  { key: 'cook', icon: '🍳', label: '做饭' },
  { key: 'business', icon: '💰', label: '生意' },
  { key: 'color', icon: '🎨', label: '颜色' },
];

export default function NumberCalculatorPage({ goBack }: Props) {
  const [tab, setTab] = useState<TabKey>('calc');
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [fromCurrency, setFromCurrency] = useState<Currency>('kip');
  const [showConverter, setShowConverter] = useState(false);
  const [showLaoPanel, setShowLaoPanel] = useState(false);
  const { speakLao, speakSlow, isSpeaking } = useSpeech();

  const formatNumber = useCallback((num: number): string => {
    if (Number.isInteger(num) && Math.abs(num) < 1e15) return num.toLocaleString('en-US');
    const str = num.toString();
    if (str.includes('.')) {
      const [i, d] = str.split('.');
      return parseInt(i).toLocaleString('en-US') + '.' + d;
    }
    return str;
  }, []);

  const displayText = useMemo(() => {
    if (result !== null) return formatNumber(result);
    if (!expression) return '0';
    return expression.replace(/(\d+)(\.\d+)?/g, (m) => {
      const n = parseFloat(m); return isNaN(n) ? m : formatNumber(n);
    });
  }, [expression, result, formatNumber]);

  const currentNumber = useMemo(() => {
    if (result !== null) return result;
    const n = parseFloat(expression); return isNaN(n) ? null : n;
  }, [expression, result]);

  const laoText = useMemo(() => {
    if (currentNumber === null) return null;
    const n = Math.floor(Math.abs(currentNumber));
    if (n === 0 && currentNumber !== 0) return null;
    return numberToLao(n);
  }, [currentNumber]);

  // 自动播报
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (laoText && currentNumber && currentNumber > 0) {
      timer.current = setTimeout(() => speakLao(laoText, 1.3), 800);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [laoText, currentNumber, speakLao]);

  const conversions = useMemo(() => {
    const n = result !== null ? result : parseFloat(expression);
    if (isNaN(n) || n <= 0) return null;
    const k = fromCurrency === 'kip' ? n : n * RATES[fromCurrency];
    return { kip: Math.round(k), cny: (k / RATES.cny).toFixed(2), usd: (k / RATES.usd).toFixed(2), thb: (k / RATES.thb).toFixed(0) };
  }, [expression, result, fromCurrency]);

  const handleButton = useCallback((key: string) => {
    if (laoOperators[key]) speakLao(laoOperators[key], 1.3);
    if (key === 'AC') { setExpression(''); setResult(null); return; }
    if (key === '⌫') { if (result !== null) { setResult(null); setExpression(''); } else setExpression(p => p.slice(0, -1)); return; }
    if (key === '%') { if (result !== null) setResult(result / 100); else { const n = parseFloat(expression); if (!isNaN(n)) { setResult(n / 100); setExpression(''); } } return; }
    if (key === '+/-') { if (result !== null) setResult(-result); else { const n = parseFloat(expression); if (!isNaN(n)) setExpression((-n).toString()); } return; }
    if (key === '=') { if (expression) { const r = safeEval(expression); if (r !== null) { setResult(r); setExpression(''); } } return; }
    if (['+', '-', '×', '÷'].includes(key)) {
      if (result !== null) { setExpression(result.toString() + ' ' + key + ' '); setResult(null); }
      else if (expression) { const t = expression.trimEnd(); setExpression((/[+\-×÷]\s*$/.test(t) ? t.replace(/[+\-×÷]\s*$/, '') : t) + ' ' + key + ' '); }
      return;
    }
    if (result !== null) { setResult(null); setExpression(key); } else setExpression(p => p + key);
  }, [expression, result, speakLao]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleButton(e.key);
      else if (e.key === '.') handleButton('.');
      else if (e.key === '+') handleButton('+');
      else if (e.key === '-') handleButton('-');
      else if (e.key === '*') handleButton('×');
      else if (e.key === '/') { e.preventDefault(); handleButton('÷'); }
      else if (e.key === 'Enter' || e.key === '=') handleButton('=');
      else if (e.key === 'Backspace') handleButton('⌫');
      else if (e.key === 'Escape') handleButton('AC');
      else if (e.key === '%') handleButton('%');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleButton]);

  const rows = [
    [{ label: 'AC', type: 'func' }, { label: '+/-', type: 'func' }, { label: '%', type: 'func' }, { label: '÷', type: 'op' }],
    [{ label: '7', type: 'num' }, { label: '8', type: 'num' }, { label: '9', type: 'num' }, { label: '×', type: 'op' }],
    [{ label: '4', type: 'num' }, { label: '5', type: 'num' }, { label: '6', type: 'num' }, { label: '-', type: 'op' }],
    [{ label: '1', type: 'num' }, { label: '2', type: 'num' }, { label: '3', type: 'num' }, { label: '+', type: 'op' }],
    [{ label: '0', type: 'num', wide: true }, { label: '.', type: 'num' }, { label: '=', type: 'op' }],
  ];

  const btnStyle = (t: string) => t === 'func'
    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300'
    : t === 'op'
    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 active:from-orange-600 active:to-amber-600 shadow-lg shadow-orange-500/20'
    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 shadow-sm';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="glass bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50 px-5 py-3 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-90">
          <svg className="w-4 h-4 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-bold dark:text-white">计算器</h1>
      </div>

      {/* Tab Bar */}
      <div className="px-5 py-2.5">
        <div className="flex gap-1.5 bg-white dark:bg-[#1A1A1A] rounded-2xl p-1.5 shadow-sm">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-xl text-center transition-all ${
                tab === t.key
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}>
              <div className="text-sm">{t.icon}</div>
              <div className="text-[10px] font-semibold mt-0.5">{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ======== 计算器 Tab ======== */}
      {tab === 'calc' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col bg-white dark:bg-[#1A1A1A] mx-3 mt-2 rounded-3xl shadow-lg shadow-black/5 overflow-hidden">
            {/* Display */}
            <div className="flex-1 flex flex-col justify-end px-6 pb-4 pt-6 min-h-[180px]">
              <div className="text-right text-gray-300 dark:text-gray-600 text-base h-7 overflow-hidden font-light tracking-wide">
                {expression || '\u00A0'}
              </div>
              <div className={`text-right font-light tracking-tight transition-all duration-200 ${
                result !== null ? 'text-5xl text-gray-900 dark:text-white' : 'text-4xl text-gray-600 dark:text-gray-300'
              }`}>{displayText}</div>
            </div>

            {/* Lao Bar */}
            {laoText && currentNumber && currentNumber > 0 && (
              <div className="mx-4 mb-2">
                <button onClick={() => setShowLaoPanel(!showLaoPanel)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-blue-500 text-lg">🇱🇦</span>
                    <span className="lao-text text-blue-700 dark:text-blue-300 text-sm font-medium truncate">{laoText}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); speakLao(laoText, 1.3); }} disabled={isSpeaking}
                      className="p-1.5 bg-blue-200 dark:bg-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-xs">🔊</button>
                    <button onClick={e => { e.stopPropagation(); speakSlow(laoText); }} disabled={isSpeaking}
                      className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 text-xs">🐢</button>
                    <span className="text-gray-400 text-xs ml-1">{showLaoPanel ? '▲' : '▼'}</span>
                  </div>
                </button>
                {showLaoPanel && (
                  <div className="mt-2 p-4 bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                    <div className="lao-text text-3xl font-bold text-gray-800 dark:text-white mb-2">{laoText}</div>
                    <div className="text-xs text-gray-400 mb-3">老挝语读法</div>
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => speakLao(laoText, 1.3)} disabled={isSpeaking}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium active:scale-95">🔊 正常</button>
                      <button onClick={() => speakSlow(laoText)} disabled={isSpeaking}
                        className="px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium active:scale-95">🐢 慢速</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Numpad */}
            <div className="px-3 pb-3 space-y-2">
              {rows.map((row, ri) => (
                <div key={ri} className="flex gap-2">
                  {row.map(b => (
                    <button key={b.label} onClick={() => handleButton(b.label)}
                      className={`${b.wide ? 'flex-[2.1]' : 'flex-1'} h-[58px] rounded-2xl text-xl font-medium transition-all active:scale-[0.95] active:brightness-90 ${btnStyle(b.type)}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Quick amounts */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {[{ l: '1千', v: 1000 }, { l: '5千', v: 5000 }, { l: '1万', v: 10000 }, { l: '5万', v: 50000 },
                { l: '10万', v: 100000 }, { l: '50万', v: 500000 }, { l: '100万', v: 1000000 }, { l: '500万', v: 5000000 },
              ].map(p => (
                <button key={p.v} onClick={() => { setResult(p.v); setExpression(''); }}
                  className="px-3 py-1.5 bg-white dark:bg-[#1A1A1A] rounded-2xl text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm hover:text-orange-500 transition-colors whitespace-nowrap flex-shrink-0">
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="px-4 pb-4">
            <button onClick={() => setShowConverter(!showConverter)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">💱 货币换算</span>
              <span className="text-xs text-gray-400">{showConverter ? '收起 ▲' : '展开 ▼'}</span>
            </button>
            {showConverter && (
              <div className="mt-2 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="flex gap-1.5 mb-3">
                  {(Object.keys(RATES) as Currency[]).map(c => (
                    <button key={c} onClick={() => setFromCurrency(c)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                        fromCurrency === c ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>{CURRENCY_FLAGS[c]} {c.toUpperCase()}</button>
                  ))}
                </div>
                {conversions && (
                  <div className="grid grid-cols-2 gap-2">
                    {(['kip', 'cny', 'usd', 'thb'] as Currency[]).map(c => (
                      <div key={c} className={`rounded-xl p-3 ${c === fromCurrency ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200' : 'bg-gray-50 dark:bg-gray-700'}`}>
                        <div className="text-[10px] text-gray-500">{CURRENCY_FLAGS[c]} {CURRENCY_LABELS[c]}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-white mt-1">
                          {c === 'kip' ? conversions.kip.toLocaleString() : c === 'cny' ? `¥${conversions.cny}` : c === 'usd' ? `$${conversions.usd}` : `฿${conversions.thb}`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-gray-400 text-center mt-3">* 汇率仅供参考</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======== 农场 Tab ======== */}
      {tab === 'farm' && (
        <div className="flex-1 px-4 py-3 space-y-3 overflow-auto">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🌱 作物</h3>
            <GridWords items={CROPS} bgColor="bg-green-50 dark:bg-green-900/20" speakLao={speakLao} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🚜 农活</h3>
            <WordList items={FARM_SENTENCES} color="text-green-600 dark:text-green-400" speakLao={speakLao} speakSlow={speakSlow} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🏭 红薯粉加工</h3>
            <WordList items={PROCESSING} color="text-orange-600 dark:text-orange-400" speakLao={speakLao} speakSlow={speakSlow} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">👷 管理工人</h3>
            <WordList items={WORKER} color="text-blue-600 dark:text-blue-400" speakLao={speakLao} speakSlow={speakSlow} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">📦 量词</h3>
            <GridWords items={UNITS} bgColor="bg-gray-50 dark:bg-gray-700" speakLao={speakLao} isSpeaking={isSpeaking} />
          </div>
        </div>
      )}

      {/* ======== 做饭 Tab ======== */}
      {tab === 'cook' && (
        <div className="flex-1 px-4 py-3 space-y-3 overflow-auto">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🥘 做法</h3>
            <GridWords items={COOKING.slice(0, 8)} bgColor="bg-orange-50 dark:bg-orange-900/20" speakLao={speakLao} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🧂 调料</h3>
            <GridWords items={COOKING.slice(8, 14)} bgColor="bg-yellow-50 dark:bg-yellow-900/20" speakLao={speakLao} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🥩 食材</h3>
            <GridWords items={COOKING.slice(14, 22)} bgColor="bg-red-50 dark:bg-red-900/20" speakLao={speakLao} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">😋 口味 & 用餐</h3>
            <WordList items={COOKING.slice(22)} color="text-orange-600 dark:text-orange-400" speakLao={speakLao} speakSlow={speakSlow} isSpeaking={isSpeaking} />
          </div>
        </div>
      )}

      {/* ======== 生意 Tab ======== */}
      {tab === 'business' && (
        <div className="flex-1 px-4 py-3 space-y-3 overflow-auto">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">💰 卖货</h3>
            <WordList items={SELLING} color="text-amber-600 dark:text-amber-400" speakLao={speakLao} speakSlow={speakSlow} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🗣️ 砍价</h3>
            <WordList items={PHRASES} color="text-blue-600 dark:text-blue-400" speakLao={speakLao} speakSlow={speakSlow} isSpeaking={isSpeaking} />
          </div>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🔢 数字发音</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.entries(laoDigits).map(([num, lao]) => (
                <button key={num} onClick={() => speakLao(lao, 1.3)} disabled={isSpeaking}
                  className="flex flex-col items-center py-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">{num}</span>
                  <span className="lao-text text-[10px] text-blue-600 dark:text-blue-400 font-medium">{lao}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======== 颜色 Tab ======== */}
      {tab === 'color' && (
        <div className="flex-1 px-4 py-3 space-y-3 overflow-auto">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-4 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🎨 颜色</h3>
            <div className="grid grid-cols-3 gap-2">
              {COLORS.map((c, i) => {
                // 预览色块
                const colorMap: Record<string, string> = {
                  '红色': '#ef4444', '绿色': '#22c55e', '蓝色': '#3b82f6', '黄色': '#eab308',
                  '白色': '#f8fafc', '黑色': '#1e293b', '橙色': '#f97316', '紫色': '#a855f7',
                  '粉色': '#ec4899', '灰色': '#94a3b8', '棕色': '#a16207', '金色': '#ca8a04',
                  '银色': '#cbd5e1', '深色': '#334155', '浅色': '#e2e8f0',
                };
                const bg = colorMap[c.cn] || '#94a3b8';
                const isLight = ['白色', '黄色', '银色', '浅色', '金色'].includes(c.cn);
                return (
                  <button key={i} onClick={() => speakLao(c.lao, 1.3)} disabled={isSpeaking}
                    className="flex flex-col items-center py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all active:scale-95"
                    style={{ backgroundColor: bg }}>
                    <span className={`text-sm font-bold ${isLight ? 'text-gray-800' : 'text-white'}`}>{c.cn}</span>
                    <span className={`lao-text text-xs font-medium ${isLight ? 'text-gray-600' : 'text-white/90'}`}>{c.lao}</span>
                    <span className={`text-[9px] mt-0.5 ${isLight ? 'text-gray-400' : 'text-white/60'}`}>{c.pinyin}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
