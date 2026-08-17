import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useFavorites } from '../hooks/useFavorites';
import SpeechPractice from '../components/SpeechPractice';

interface Props {
  goBack: () => void;
}

interface Phrase {
  lao: string;
  chinese: string;
  pinyin: string;
}

interface Scenario {
  icon: string;
  title: string;
  phrases: Phrase[];
}

const scenarios: Scenario[] = [
  {
    icon: '🛃',
    title: '海关入境',
    phrases: [
      { lao: 'ຂ້ອຍ ແມ່ນ ຄົນຈີນ', chinese: '我是中国人', pinyin: 'khoi maen khon jin' },
      { lao: 'ຂ້ອຍ ມາ ທ່ຽວ', chinese: '我来旅游', pinyin: 'khoi ma thiao' },
      { lao: 'ຂ້ອຍ ມາ ເຮັດວຽກ', chinese: '我来工作', pinyin: 'khoi ma het wiak' },
      { lao: 'ນີ້ ແມ່ນ ຫນັງສືຜ່ານຂອບຂອຍ', chinese: '这是我的护照', pinyin: 'ni maen nangsue pha khoi' },
      { lao: 'ຂ້ອຍ ຈະ ຢູ່ ສິບ ມື້', chinese: '我会待10天', pinyin: 'kha ja yu sip meu' },
    ],
  },
  {
    icon: '🏥',
    title: '医院看病',
    phrases: [
      { lao: 'ຂ້ອຍ ເຈັບ', chinese: '我生病了', pinyin: 'khoi jep' },
      { lao: 'ຂ້ອຍ ເຈັບຫົວ', chinese: '我头痛', pinyin: 'khoi jep hua' },
      { lao: 'ຂ້ອຍ ເຈັບທ້ອງ', chinese: '我肚子痛', pinyin: 'khoi jep thong' },
      { lao: 'ຂ້ອຍ ເປັນໄຂ້', chinese: '我发烧', pinyin: 'khoi pen khai' },
      { lao: 'ຢູ່ ໃສ ມີ ໂຮງຫມໍ?', chinese: '哪里有医院？', pinyin: 'yu sai mii hongmo?' },
      { lao: 'ຂ້ອຍ ຕ້ອງການ ເຫັນ ໝໍ', chinese: '我要看医生', pinyin: 'khoi tongkan hen mo' },
    ],
  },
  {
    icon: '🏦',
    title: '银行换钱',
    phrases: [
      { lao: 'ຂ້ອຍ ຢາກ ແລກເງິນ', chinese: '我想换钱', pinyin: 'khoi yak laek ngoen' },
      { lao: 'ອັດຕາ ການ ແລກປ່ຽນ ເທົ່າໃດ?', chinese: '汇率多少？', pinyin: 'ata kan laek pian thao dai?' },
      { lao: 'ຂ້ອຍ ຢາກ ແລກ ຢວນ ເປັນ ກີບ', chinese: '我想把人民币换成基普', pinyin: 'khoi yak laek yuan pen kip' },
      { lao: 'ບັດ ATM ຢູ່ ໃສ?', chinese: 'ATM在哪？', pinyin: 'bat ATM yu sai?' },
    ],
  },
  {
    icon: '📞',
    title: '打电话',
    phrases: [
      { lao: 'ເບີ ໂທລະສັບ ຂອງທ່ານ ແມ່ນ ຫຍັງ?', chinese: '你的电话号码是多少？', pinyin: 'bo tholasap khong than maen yang?' },
      { lao: 'ຂ້ອຍ ຢາກໂທ ຫາ ຈີນ', chinese: '我想打电话到中国', pinyin: 'khoi yak tho ha jin' },
      { lao: 'ຊ່ວຍ ໂທ ໃຫ້ ແດ່', chinese: '帮我打一下', pinyin: 'suai tho hai dae' },
      { lao: 'ບໍ່ ໄດ້ ຍິນ', chinese: '听不见', pinyin: 'bo dai nyin' },
    ],
  },
  {
    icon: '🏠',
    title: '租房',
    phrases: [
      { lao: 'ຂ້ອຍ ຢາກ ເຊົ່າ ຫ້ອງ', chinese: '我想租房', pinyin: 'khoi yak sao hong' },
      { lao: 'ຄ່າເຊົ່າ ເດືອນລະ ເທົ່າໃດ?', chinese: '月租多少？', pinyin: 'kha sao duean la thao dai?' },
      { lao: 'ມີ ນ້ຳ ມີ ໄຟ ບໍ່?', chinese: '有水电吗？', pinyin: 'mii nam mii fai bo?' },
      { lao: 'ຂ້ອຍ ຢາກ ເບິ່ງ ຫ້ອງກ່ອນ', chinese: '我想先看看房', pinyin: 'khoi yak boeng hong kon' },
      { lao: 'ສັນຍາ ເຊົ່າ ກີ່ ເດືອນ?', chinese: '租约几个月？', pinyin: 'sanya sao ki duean?' },
    ],
  },
  {
    icon: '🚨',
    title: '报警求助',
    phrases: [
      { lao: 'ຊ່ວຍແດ່! ຊ່ວຍແດ່!', chinese: '救命！救命！', pinyin: 'suai dae! suai dae!' },
      { lao: 'ໂທ ໄປ ຕຳຫຼວດ', chinese: '打电话给警察', pinyin: 'tho pai tamruat' },
      { lao: 'ຂ້ອຍ ຖືກ ລັກ', chinese: '我被偷了', pinyin: 'khoi thuek lak' },
      { lao: 'ຂ້ອຍ ຫຼົງທາງ', chinese: '我迷路了', pinyin: 'khoi long thang' },
      { lao: 'ຊ່ວຍ ແປ ໃຫ້ ແດ່', chinese: '帮我翻译一下', pinyin: 'suai pae hai dae' },
    ],
  },
];

export default function ScenarioPage({ goBack }: Props) {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [practicePhrase, setPracticePhrase] = useState<Phrase | null>(null);
  const { speakLao, isSpeaking } = useSpeech();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (selectedScenario !== null) {
    const scenario = scenarios[selectedScenario];
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSelectedScenario(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold dark:text-white">{scenario.icon} {scenario.title}</h1>
        </div>

        <div className="px-4 py-4 space-y-2">
          {scenario.phrases.map((phrase, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="lao-text text-xl font-semibold text-gray-800 dark:text-white">{phrase.lao}</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">{phrase.chinese}</div>
                  <div className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-mono">{phrase.pinyin}</div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => speakLao(phrase.lao)}
                    disabled={isSpeaking}
                    className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => setPracticePhrase(phrase)}
                    className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm"
                  >
                    🎤
                  </button>
                  <button
                    onClick={() => toggleFavorite(phrase.lao)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isFavorite(phrase.lao) ? 'bg-red-100 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {isFavorite(phrase.lao) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {practicePhrase && (
          <SpeechPractice
            targetText={practicePhrase.lao}
            chineseText={practicePhrase.chinese}
            pinyin={practicePhrase.pinyin}
            onClose={() => setPracticePhrase(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold dark:text-white">场景短语</h1>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {scenarios.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelectedScenario(i)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700
                       hover:shadow-md hover:border-blue-200 transition-all text-center"
          >
            <div className="text-4xl mb-3">{s.icon}</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">{s.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.phrases.length} 句常用</p>
          </button>
        ))}
      </div>
    </div>
  );
}
