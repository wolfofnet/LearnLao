// 常用对话 - 做生意场景
export interface DialogueLine {
  lao: string;
  chinese: string;
  pinyin: string;
  speaker: 'A' | 'B';
}

export interface Dialogue {
  title: string;
  scenario: string;
  level: 1 | 2 | 3;
  lines: DialogueLine[];
}

export const dialogues: Dialogue[] = [
  {
    title: '问价格',
    scenario: '在市场买东西',
    level: 1,
    lines: [
      { lao: 'ສະບາຍດີ, ຂໍຖາມແດ່', chinese: '你好，我想问一下', pinyin: 'sabai dii, kho tham dae', speaker: 'A' },
      { lao: 'ສະບາຍດີ, ໄດ້ເລີຍ', chinese: '你好，请说', pinyin: 'sabai dii, dai loei', speaker: 'B' },
      { lao: 'ອັນນີ້ ລາຄາ ເທົ່າໃດ?', chinese: '这个多少钱？', pinyin: 'an ni, laka thao dai?', speaker: 'A' },
      { lao: 'ອັນນີ້ ສາມ ແສນ ກີບ', chinese: '这个三万基普', pinyin: 'an ni, sam saen kip', speaker: 'B' },
      { lao: 'ຖືກກວ່າໄດ້ບໍ່?', chinese: '能便宜点吗？', pinyin: 'thuek kwa dai bo?', speaker: 'A' },
      { lao: 'ໄດ້, ຫຼຸດໃຫ້ ສອງ ແສນ ເກົ້າ', chinese: '行，给你减到两万九', pinyin: 'dai, lut hai, song saen gao', speaker: 'B' },
      { lao: 'ໄດ້, ເອົາ ອັນນີ້', chinese: '好，要这个', pinyin: 'dai, ao an ni', speaker: 'A' },
      { lao: 'ຂອບໃຈຫຼາຍ', chinese: '非常感谢', pinyin: 'khop chai lai', speaker: 'B' },
    ],
  },
  {
    title: '打车',
    scenario: '坐出租车去酒店',
    level: 1,
    lines: [
      { lao: 'ລົດແທັກຊີ, ໄປ ໂຮງແຮມ', chinese: '出租车，去酒店', pinyin: 'lot taxi, pai hong haem', speaker: 'A' },
      { lao: 'ໄປ ໂຮງແຮມ ໃດ?', chinese: '去哪个酒店？', pinyin: 'pai hong haem dai?', speaker: 'B' },
      { lao: 'ໂຮງແຮມ ວຽງຈັນ', chinese: '万象酒店', pinyin: 'hong haem viang chan', speaker: 'A' },
      { lao: 'ໄດ້, ໂດຍ', chinese: '好的，走', pinyin: 'dai, doy', speaker: 'B' },
      { lao: 'ໃຊ້ເວລາ ເທົ່າໃດ?', chinese: '要多久？', pinyin: 'sai wela thao dai?', speaker: 'A' },
      { lao: 'ປະມານ ຊາມ ສິບ ນາທີ', chinese: '大概三十分钟', pinyin: 'paman sam sip nathi', speaker: 'B' },
      { lao: 'ລາຄາ ເທົ່າໃດ?', chinese: '多少钱？', pinyin: 'laka thao dai?', speaker: 'A' },
      { lao: 'ສອງ ແສນ ກີບ', chinese: '两万基普', pinyin: 'song saen kip', speaker: 'B' },
      { lao: 'ມາຮອດແລ້ວ, ຂອບໃຈ', chinese: '到了，谢谢', pinyin: 'ma hot laew, khop chai', speaker: 'A' },
    ],
  },
  {
    title: '餐厅点餐',
    scenario: '在老挝餐厅吃饭',
    level: 1,
    lines: [
      { lao: 'ຂໍເບິ່ງເມນູແດ່', chinese: '看一下菜单', pinyin: 'kho boeng menu dae', speaker: 'A' },
      { lao: 'ນີ້ເລີຍ, ເອົາຫຍັງ?', chinese: '给，要什么？', pinyin: 'ni loei, ao yang?', speaker: 'B' },
      { lao: 'ເອົາ ເຂົ້າ ຜັດ ແລະ ຕຳ ຍຳ', chinese: '要炒饭和木瓜沙拉', pinyin: 'ao khao phat lae tam yam', speaker: 'A' },
      { lao: 'ກິນ ນ້ຳ ຫຍັງ?', chinese: '喝什么？', pinyin: 'kin nam yang?', speaker: 'B' },
      { lao: 'ນ້ຳ ແກ້ວ ນຶ່ງ', chinese: '一瓶水', pinyin: 'nam gaeo nueng', speaker: 'A' },
      { lao: 'ເຜັດ ແນວໃດ?', chinese: '要多辣？', pinyin: 'phet niao dai?', speaker: 'B' },
      { lao: 'ບໍ່ ເຜັດ', chinese: '不要辣', pinyin: 'bo phet', speaker: 'A' },
      { lao: 'ລໍຖ້າ ສິບ ນາທີ', chinese: '等十分钟', pinyin: 'lo tha sip nathi', speaker: 'B' },
    ],
  },
  {
    title: '谈生意',
    scenario: '和老挝商人谈合作',
    level: 2,
    lines: [
      { lao: 'ຍິນດີທີ່ໄດ້ຮູ້ຈັກ', chinese: '很高兴认识你', pinyin: 'yin dii thi dai hu jak', speaker: 'A' },
      { lao: 'ຍິນດີ ເຊັ່ນກັນ', chinese: '我也很高兴', pinyin: 'yin dii sen kan', speaker: 'B' },
      { lao: 'ຂ້ອຍ ຢາກ ສົນທະນາ ເລື່ອງ ການຄ້າ', chinese: '我想聊聊贸易的事', pinyin: 'khoi yak sonthana lueang kankha', speaker: 'A' },
      { lao: 'ໄດ້ເລີຍ, ທ່ານ ມີ ສິນຄ້າ ຫຍັງ?', chinese: '好的，你有什么商品？', pinyin: 'dai loei, than mii sinka yang?', speaker: 'B' },
      { lao: 'ມີ ຜົນໄມ້ ແລະ ຜັກ', chinese: '有水果和蔬菜', pinyin: 'phon mai lae phak', speaker: 'A' },
      { lao: 'ລາຄາ ຂາຍ ສົ່ງ ເທົ່າໃດ?', chinese: '批发价多少？', pinyin: 'laka kha song thao dai?', speaker: 'B' },
      { lao: 'ສົ່ງ ໃຫ້ ລາຄາ ພິເສດ', chinese: '给你特价', pinyin: 'song hai laka phiset', speaker: 'A' },
      { lao: 'ຕົກລົງ, ສັ່ງ ຊື້', chinese: '成交，下单', pinyin: 'tok long, song sue', speaker: 'B' },
    ],
  },
];
