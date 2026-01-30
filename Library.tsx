
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Download, Search, RefreshCw, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { allBooks, BookItem } from '../data/booksData';
import { searchLatestCurriculum } from '../services/geminiService';

interface LibraryProps {
  onSelectBook: (bookId: string) => void;
}

const Library: React.FC<LibraryProps> = ({ onSelectBook }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{text: string, sources: any[]} | null>(null);

  // Filter books based on user's profile
  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      const matchesProfile = 
        book.education === user?.educationType && 
        book.grade === user?.grade && 
        book.specialty.includes(user?.specialty);
      
      const matchesSearch = 
        book.title.includes(searchTerm) || 
        book.subject.includes(searchTerm);

      return matchesProfile && matchesSearch;
    });
  }, [user, searchTerm]);

  const handleSmartSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    setSyncResult(null);
    
    const result = await searchLatestCurriculum(user.educationType, user.grade, user.specialty);
    setSyncResult(result);
    setIsSyncing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            المكتبة الرقمية المحدثة <ShieldCheck className="text-blue-600" />
          </h2>
          <p className="text-gray-500 font-semibold">تصفح أكثر من 50 كتاباً دراسياً لمنهج {user?.grade} لعام 2024/2025</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSmartSync}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black shadow-lg transition-all ${
              isSyncing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'جاري البحث في الويب...' : 'تحديث المنهج ذكياً'}
          </button>
        </div>
      </header>

      {syncResult && (
        <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-xl animate-in zoom-in duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-indigo-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600" /> نتائج البحث الذكي عن المنهج الجديد
            </h3>
            <button onClick={() => setSyncResult(null)} className="text-gray-400 hover:text-red-500 font-black">إغلاق</button>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed bg-indigo-50/50 p-4 rounded-2xl whitespace-pre-wrap font-semibold mb-4 border border-indigo-50">
            {syncResult.text}
          </div>
          {syncResult.sources.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">المصادر المكتشفة:</p>
              <div className="flex flex-wrap gap-2">
                {syncResult.sources.map((chunk: any, i: number) => (
                  chunk.web && (
                    <a 
                      key={i} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 transition-colors"
                    >
                      <ExternalLink size={12} /> {chunk.web.title || 'رابط المنهج'}
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative w-full">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث بين 50+ كتاب عن مادة معينة أو عنوان..." 
          className="w-full bg-white border-gray-100 border py-5 pr-14 pl-6 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold text-lg transition-all"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {filteredBooks.map((book) => (
          <div key={book.id} className="group relative">
            <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-2xl">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 right-3">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                  {book.year}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-6 text-center">
                <button 
                  onClick={() => onSelectBook(book.id)}
                  className="bg-blue-600 text-white w-full py-4 rounded-2xl mb-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 shadow-xl active:scale-95 transition-transform"
                >
                  <BookOpen size={18} /> ابدأ المذاكرة
                </button>
                <button className="bg-white/10 backdrop-blur-xl text-white w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                  <Download size={18} /> تحميل PDF
                </button>
              </div>
            </div>
            <div className="mt-5 px-1">
              <h4 className="font-black text-gray-900 truncate text-lg group-hover:text-blue-600 transition-colors">{book.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-blue-600 font-black px-2 py-0.5 bg-blue-50 rounded-md">{book.subject}</p>
                <p className="text-[10px] text-gray-400 font-bold">{book.grade}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-black text-gray-400">لم نجد كتباً تطابق بحثك</h3>
          <p className="text-gray-400 font-bold mt-2">جرب البحث بكلمات أخرى أو استخدم التحديث الذكي</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group">
        <Sparkles className="absolute top-10 right-10 opacity-20 group-hover:rotate-12 transition-transform duration-1000" size={80} />
        <div className="z-10">
          <h4 className="text-3xl font-black mb-2">أتمتة المنهج السنوية مفعلة ✅</h4>
          <p className="text-blue-100 font-bold text-lg opacity-90">
            يقوم نظام MEMO AI الذكي بتحديث هذه المكتبة تلقائياً في بداية كل عام دراسي (شهر سبتمبر) لضمان حصولك على أحدث الكتب.
          </p>
        </div>
        <div className="mt-8 md:mt-0 z-10">
          <button className="bg-white text-blue-600 px-10 py-5 rounded-[2rem] font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95">
            تحميل المنهج كاملاً
          </button>
        </div>
      </div>
    </div>
  );
};

export default Library;
