// 实用词汇 - 做生意/工作场景
export interface VocabItem {
  lao: string;
  chinese: string;
  pinyin: string;    // 近似中文发音
  category: string;
  level: 1 | 2 | 3; // 1=入门 2=进阶 3=高级
}

export const vocabulary: VocabItem[] = [
  // 数字与货币
  { lao: 'ໜຶ່ງ', chinese: '一', pinyin: 'nueng', category: '数字', level: 1 },
  { lao: 'ສອງ', chinese: '二', pinyin: 'song', category: '数字', level: 1 },
  { lao: 'ສາມ', chinese: '三', pinyin: 'sam', category: '数字', level: 1 },
  { lao: 'ສີ່', chinese: '四', pinyin: 'si', category: '数字', level: 1 },
  { lao: 'ຫ້າ', chinese: '五', pinyin: 'ha', category: '数字', level: 1 },
  { lao: 'ຫົກ', chinese: '六', pinyin: 'hok', category: '数字', level: 1 },
  { lao: 'ເຈັດ', chinese: '七', pinyin: 'jet', category: '数字', level: 1 },
  { lao: 'ແປດ', chinese: '八', pinyin: 'paet', category: '数字', level: 1 },
  { lao: 'ເກົ້າ', chinese: '九', pinyin: 'gao', category: '数字', level: 1 },
  { lao: 'ສິບ', chinese: '十', pinyin: 'sip', category: '数字', level: 1 },
  { lao: 'ຮ້ອຍ', chinese: '百', pinyin: 'hoi', category: '数字', level: 1 },
  { lao: 'ພັນ', chinese: '千', pinyin: 'pan', category: '数字', level: 1 },
  { lao: 'ແສນ', chinese: '万', pinyin: 'saen', category: '数字', level: 2 },
  { lao: 'ລ້ານ', chinese: '百万', pinyin: 'lan', category: '数字', level: 2 },
  { lao: 'ກີບ', chinese: '基普(老挝货币)', pinyin: 'kip', category: '货币', level: 1 },
  { lao: 'ບາດ', chinese: '泰铢', pinyin: 'baht', category: '货币', level: 1 },
  { lao: 'ໂດລາ', chinese: '美元', pinyin: 'dola', category: '货币', level: 1 },
  { lao: 'ຢວນ', chinese: '人民币', pinyin: 'yuan', category: '货币', level: 1 },

  // 做生意
  { lao: 'ຊື້', chinese: '买', pinyin: 'sue', category: '做生意', level: 1 },
  { lao: 'ຂາຍ', chinese: '卖', pinyin: 'khai', category: '做生意', level: 1 },
  { lao: 'ລາຄາ', chinese: '价格', pinyin: 'laka', category: '做生意', level: 1 },
  { lao: 'ຖືກ', chinese: '便宜', pinyin: 'thuek', category: '做生意', level: 1 },
  { lao: 'ແພງ', chinese: '贵', pinyin: 'phaeng', category: '做生意', level: 1 },
  { lao: 'ຫຼຸດ', chinese: '打折/减', pinyin: 'lut', category: '做生意', level: 1 },
  { lao: 'ເພີ່ມ', chinese: '加/增加', pinyin: 'phoem', category: '做生意', level: 2 },
  { lao: 'ກຳໄລ', chinese: '利润', pinyin: 'kamai', category: '做生意', level: 2 },
  { lao: 'ຕົ້ນທຶນ', chinese: '成本', pinyin: 'tonthon', category: '做生意', level: 2 },
  { lao: 'ສິນຄ້າ', chinese: '商品/货物', pinyin: 'sinka', category: '做生意', level: 1 },
  { lao: 'ຮ້ານ', chinese: '店/商店', pinyin: 'han', category: '做生意', level: 1 },
  { lao: 'ຕະຫຼາດ', chinese: '市场', pinyin: 'talat', category: '做生意', level: 1 },
  { lao: 'ສັ່ງຊື້', chinese: '订购', pinyin: 'songsue', category: '做生意', level: 2 },
  { lao: 'ຈ່າຍເງິນ', chinese: '付款', pinyin: 'chai ngoen', category: '做生意', level: 1 },
  { lao: 'ເງິນສົດ', chinese: '现金', pinyin: 'ngoen sot', category: '做生意', level: 1 },
  { lao: 'ໂອນເງິນ', chinese: '转账', pinyin: 'on ngoen', category: '做生意', level: 2 },
  { lao: 'ໃບບິນ', chinese: '发票/收据', pinyin: 'bai bin', category: '做生意', level: 2 },

  // 日常交流
  { lao: 'ສະບາຍດີ', chinese: '你好', pinyin: 'sabai dii', category: '日常', level: 1 },
  { lao: 'ຂອບໃຈ', chinese: '谢谢', pinyin: 'khop chai', category: '日常', level: 1 },
  { lao: 'ຂໍໂທດ', chinese: '对不起/不好意思', pinyin: 'kho thot', category: '日常', level: 1 },
  { lao: 'ບໍ່ເປັນไร', chinese: '没关系', pinyin: 'bo pen rai', category: '日常', level: 1 },
  { lao: 'ແມ່ນ', chinese: '是', pinyin: 'maen', category: '日常', level: 1 },
  { lao: 'ບໍ່', chinese: '不/不是', pinyin: 'bo', category: '日常', level: 1 },
  { lao: 'ໄດ້', chinese: '可以/行', pinyin: 'dai', category: '日常', level: 1 },
  { lao: 'ຊ່ວຍແດ່', chinese: '帮帮忙', pinyin: 'suai dae', category: '日常', level: 1 },
  { lao: 'ເທົ່າໃດ', chinese: '多少钱', pinyin: 'thao dai', category: '日常', level: 1 },
  { lao: 'ຢູ່ໃສ', chinese: '在哪里', pinyin: 'yu sai', category: '日常', level: 1 },
  { lao: 'ກິນເຂົ້າ', chinese: '吃饭', pinyin: 'kin khao', category: '日常', level: 1 },
  { lao: 'ນ້ຳ', chinese: '水', pinyin: 'nam', category: '日常', level: 1 },
  { lao: 'ເບີໂທ', chinese: '电话号码', pinyin: 'bo tho', category: '日常', level: 1 },
  { lao: 'ຊື່', chinese: '名字', pinyin: 'sue', category: '日常', level: 1 },
  { lao: 'ຈີນ', chinese: '中国', pinyin: 'jin', category: '日常', level: 1 },
  { lao: 'ຄົນຈີນ', chinese: '中国人', pinyin: 'khon jin', category: '日常', level: 1 },

  // 交通出行
  { lao: 'ລົດ', chinese: '车', pinyin: 'lot', category: '交通', level: 1 },
  { lao: 'ລົດແທັກຊີ', chinese: '出租车', pinyin: 'lot taxi', category: '交通', level: 1 },
  { lao: 'ລົດເມ', chinese: '公交车', pinyin: 'lot me', category: '交通', level: 1 },
  { lao: 'ສະໜາມບິນ', chinese: '机场', pinyin: 'sanam bin', category: '交通', level: 1 },
  { lao: 'ໂຮງແຮມ', chinese: '酒店', pinyin: 'hong haem', category: '交通', level: 1 },
  { lao: 'ທາງ', chinese: '路', pinyin: 'thang', category: '交通', level: 1 },
  { lao: 'ໄກ', chinese: '远', pinyin: 'gai', category: '交通', level: 1 },
  { lao: 'ໃກ້', chinese: '近', pinyin: 'gai', category: '交通', level: 1 },
  { lao: 'ໄປ', chinese: '去', pinyin: 'pai', category: '交通', level: 1 },
  { lao: 'ມາ', chinese: '来', pinyin: 'ma', category: '交通', level: 1 },

  // 餐饮
  { lao: 'ເຂົ້າ', chinese: '米饭', pinyin: 'khao', category: '餐饮', level: 1 },
  { lao: 'ຜັກ', chinese: '蔬菜', pinyin: 'phak', category: '餐饮', level: 1 },
  { lao: 'ເນື້ອ', chinese: '肉', pinyin: 'nua', category: '餐饮', level: 1 },
  { lao: 'ປາ', chinese: '鱼', pinyin: 'pa', category: '餐饮', level: 1 },
  { lao: 'ໄກ່', chinese: '鸡', pinyin: 'gai', category: '餐饮', level: 1 },
  { lao: 'ເຜັດ', chinese: '辣', pinyin: 'phet', category: '餐饮', level: 1 },
  { lao: 'ຫວານ', chinese: '甜', pinyin: 'wan', category: '餐饮', level: 1 },
  { lao: 'ເຄັມ', chinese: '咸', pinyin: 'khem', category: '餐饮', level: 1 },
  { lao: 'ເປັນຕາ', chinese: '菜单', pinyin: 'pen ta', category: '餐饮', level: 2 },
  { lao: 'ບິນ', chinese: '账单', pinyin: 'bin', category: '餐饮', level: 1 },
];

// 获取所有分类
export const categories = [...new Set(vocabulary.map(v => v.category))];
