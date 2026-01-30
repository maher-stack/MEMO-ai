import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Clock, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MAIIcon from '../components/MAIIcon';

interface DashboardProps {
  setPage?: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  const { user, logout } = useAuth();

  const chartData = useMemo(() => [
    { name: 'السبت', hours: 2 },
    { name: 'الأحد', hours: 4 },
    { name: 'الاثنين', hours: 3 },
    { name: 'الثلاثاء', hours: 5 },
    { name: 'الأربعاء', hours: 2 },
    { name: 'الخميس', hours: 6 },
    { name: 'الجمعة', hours: 1 },
  ], []);

  const stats = useMemo(() => {
    const completedCount = user?.completedLessons.length || 0;
    const achievementRate = completedCount > 0 ? Math.min(100, Math.round((completedCount / 100) * 100)) : 0;
    return { completedCount, achievementRate };
  }, [user?.completedLessons]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Mobile Top Header */}
      <header className="flex items-center justify-between gap-4 md:hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-3xl mb-6 border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
            <MAIIcon size={24} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black dark:text-white leading-none truncate">{user?.name}</h2>
            <p className="text-[10px] text-gray-500 font-bold mt-1">{user?.grade}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl active:scale-90 transition-all border border-red-100 dark:border-red-900/30"
          title="تسجيل الخروج"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">أهلاً بك، {user?.name} 👋</h2>
          <p className="text-base text-gray-500 dark:text-gray-400 font-bold">رحلة الألف ميل مع MR AI تبدأ بمذاكرة اليوم!</p>
        </div>
        <div className="flex bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg items-center space-x-3 space-x-reverse">
          <Clock size={24} className="shrink-0" />
          <div>
            <p className="text-[10px] opacity-80 font-black uppercase tracking-wider">إجمالي المذاكرة</p>
            <p className="text-lg font-black">{user?.studyHours || 0} ساعة</p>
          </div>
        </div>
      </header>

      {/* Hero Stats Card */}
      <div className="md:hidden grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-[2rem] text-white shadow-xl shadow-blue-500/10">
          <div className="p-2 bg-white/20 rounded-xl w-fit mb-3">
            <Clock size={20} />
          </div>
          <p className="text-[10px] font-black opacity-80 uppercase">وقت المذاكرة</p>
          <p className="text-2xl font-black tracking-tight">{user?.studyHours || 0} <span className="text-sm opacity-60">ساعة</span></p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl w-fit mb-3">
            <Trophy size={20} className="text-yellow-600" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase">معدل الإنجاز</p>
          <p className="text-2xl font-black dark:text-white tracking-tight">{stats.achievementRate}<span className="text-sm text-gray-400">%</span></p>
        </div>
      </div>

      {/* AI Assistant Banner */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-800 dark:from-blue-600 dark:to-indigo-700 rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <MAIIcon size={28} className="text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight italic">اسأل MR AI الذكي! ✨</h3>
          </div>
          <p className="text-xs md:text-lg opacity-80 max-w-2xl font-bold leading-relaxed text-right">
            هل تواجه صعوبة في مسألة ما؟ أو تحتاج لتلخيص درس معقد؟ مساعد "MR AI" الذكي جاهز للإجابة على كافة أسئلتك في أي وقت.
          </p>
          <button 
            onClick={() => setPage?.('ai')}
            className="w-full md:w-auto bg-white text-blue-700 px-10 py-4 rounded-2xl font-black text-sm md:text-base hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            ابدأ المحادثة الآن
          </button>
        </div>
        <MAIIcon size={200} className="absolute -bottom-10 -left-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000" />
      </div>

      {/* Charts Section */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-2xl font-black dark:text-white">أداء المذاكرة</h3>
            <p className="text-xs text-gray-500 font-bold">ساعات التركيز خلال الأسبوع</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-green-600">نشط</span>
          </div>
        </div>
        <div className="h-64 md:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 900}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10, fontWeight: 900}} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontFamily: 'Cairo', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;