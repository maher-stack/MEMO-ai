
import React from 'react';
import { Heart, Sun, Moon, Sparkles, Book as BookIcon } from 'lucide-react';

const Religious: React.FC = () => {
  const azkarMorning = [
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", count: 1 },
    { text: "رضيت بالله رباً وبالإسلام ديناً وبمحمد صلى الله عليه وسلم نبياً", count: 3 }
  ];

  const azkarEvening = [
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
    { text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", count: 1 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center py-6">
        <h2 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-3">
          <Heart className="text-red-500 fill-red-500" />
          زادك الإيماني
        </h2>
        <p className="text-gray-500 font-semibold mt-2">لا تنسَ ذكر الله في زحام يومك</p>
      </header>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 opacity-30 animate-pulse" />
        <BookIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
        <h3 className="text-sm font-black opacity-80 mb-2">آية اليوم</h3>
        <p className="text-2xl font-black leading-relaxed mb-4">"وَقُل رَّبِّ زِدْنِي عِلْمًا"</p>
        <p className="text-xs font-bold opacity-60">سورة طه - الآية 114</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Morning Azkar */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
              <Sun size={24} />
            </div>
            <h3 className="text-xl font-black">أذكار الصباح</h3>
          </div>
          <div className="space-y-4">
            {azkarMorning.map((zikr, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group cursor-pointer active:scale-95 transition-all">
                <p className="font-bold text-gray-800 leading-loose text-center">{zikr.text}</p>
                <div className="mt-4 flex justify-center">
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black">
                    التكرار: {zikr.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evening Azkar */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Moon size={24} />
            </div>
            <h3 className="text-xl font-black">أذكار المساء</h3>
          </div>
          <div className="space-y-4">
            {azkarEvening.map((zikr, i) => (
              <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group cursor-pointer active:scale-95 transition-all">
                <p className="font-bold text-gray-800 leading-loose text-center">{zikr.text}</p>
                <div className="mt-4 flex justify-center">
                  <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-black">
                    التكرار: {zikr.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-lg">
        <h3 className="text-xl font-black mb-4">دعاء قبل المذاكرة</h3>
        <p className="text-xl font-bold leading-relaxed text-center italic">
          "اللهم إني أسألك فهم النبيين، وحفظ المرسلين، وإلهام الملائكة المقربين، اللهم اجعل ألسنتنا عامرة بذكرك، وقلوبنا بخشيتك، وأسرارنا بطاعتك، إنك على كل شيء قدير."
        </p>
      </div>
    </div>
  );
};

export default Religious;
