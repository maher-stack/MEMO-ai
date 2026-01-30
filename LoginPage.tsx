import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EducationType, Grade, Specialty } from '../types';
import { 
  AlertCircle, 
  User, 
  BookOpen, 
  GraduationCap, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ChevronLeft,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const { loginByName, register } = useAuth();
  const [mode, setMode] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    education: '' as EducationType | '',
    grade: '' as Grade | '',
    specialty: '' as Specialty | ''
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'يرجى إدخال الاسم';
    
    if (mode === 'signup') {
      if (!formData.education) newErrors.education = 'يرجى اختيار نوع التعليم';
      if (!formData.grade) newErrors.grade = 'يرجى اختيار المرحلة الدراسية';
      if (!formData.specialty) newErrors.specialty = 'يرجى اختيار التخصص الدراسي';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (validate()) {
      setIsSubmitting(true);
      try {
        if (mode === 'login') {
          await loginByName(formData.name);
        } else {
          await register(
            formData.name, 
            formData.education as EducationType, 
            formData.grade as Grade, 
            formData.specialty as Specialty
          );
        }
      } catch (err: any) {
        setAuthError(err.message || "حدث خطأ غير متوقع");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isAzhar = formData.education === EducationType.AZHAR;

  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-blue-600 dark:bg-slate-950 flex flex-col justify-end md:justify-center p-0 md:p-8 font-cairo overflow-hidden relative transition-colors duration-500">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-white/10 blur-[80px] rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-48 h-48 bg-blue-400/20 blur-[60px] rounded-full animate-bounce delay-1000"></div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white z-10 text-center space-y-4">
           <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-white/30 animate-in zoom-in duration-700">
              <Sparkles size={48} className="text-white" />
           </div>
           <h1 className="text-5xl font-black italic tracking-tighter">MR AI</h1>
           <p className="text-blue-100 font-bold max-w-xs opacity-90 text-sm leading-relaxed">
             انضم لأكثر من 5,000 طالب وباشر مذاكرتك الذكية الآن.
           </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-t-[3.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.2)] md:max-w-md md:mx-auto w-full z-20 animate-in slide-in-from-bottom-20 duration-500">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">ابدأ رحلة التفوق 🎓</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-8 text-sm text-center">يلزم إنشاء حساب لحفظ تقدمك التعليمي</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setMode('signup')}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <UserPlus size={20} /> إنشاء حساب جديد
            </button>
            
            <button 
              onClick={() => setMode('login')}
              className="w-full bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 py-5 rounded-2xl font-black border border-gray-100 dark:border-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <LogIn size={20} /> لدي حساب بالفعل
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-black">
             <ShieldCheck size={14} className="text-green-500" /> بياناتك مؤمنة بالكامل
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col p-0 font-cairo transition-colors duration-500 overflow-hidden relative">
      <header className="p-6 md:p-8 flex items-center justify-between z-10">
        <button 
          onClick={() => setMode('welcome')}
          className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-gray-600 dark:text-gray-300 active:scale-90 transition-all border border-gray-100 dark:border-slate-800"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-end">
          <h2 className="text-lg font-black text-blue-600 italic">MR AI</h2>
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-end md:justify-center p-0 md:p-8">
        <div className="bg-white dark:bg-slate-900 rounded-t-[3.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl w-full max-w-2xl mx-auto border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-500">
          <div className="mb-8">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              {mode === 'login' ? 'تسجيل دخول' : 'بيانات الحساب'}
            </h3>
            <p className="text-gray-400 font-bold text-sm">
              {mode === 'login' ? 'أدخل اسمك كما سجلته أول مرة' : 'لن يستغرق الأمر أكثر من 30 ثانية'}
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-xs animate-in shake">
              <AlertCircle size={20} className="shrink-0" />
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-black text-sm ml-2">
                <User size={16} className="text-blue-600" /> الاسم بالكامل
              </label>
              <input 
                type="text" 
                placeholder="أدخل اسمك الثلاثي"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full bg-gray-50 dark:bg-slate-800 border-2 rounded-2xl p-5 font-bold outline-none transition-all dark:text-white ${
                  errors.name ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100 dark:border-slate-800 focus:border-blue-500'
                }`}
              />
            </div>

            {mode === 'signup' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-700 dark:text-gray-300 font-black text-xs ml-2 flex items-center gap-2">
                      <GraduationCap size={14} className="text-blue-600" /> نوع التعليم
                    </label>
                    <div className="flex gap-2">
                      {Object.values(EducationType).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, education: type, specialty: ''})}
                          className={`flex-1 py-4 rounded-xl border-2 font-black text-[10px] transition-all ${
                            formData.education === type 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'border-gray-100 dark:border-slate-800 text-gray-400'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-gray-700 dark:text-gray-300 font-black text-xs ml-2 flex items-center gap-2">
                      <BookOpen size={14} className="text-blue-600" /> المرحلة الدراسية
                    </label>
                    <select 
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value as Grade})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-800 rounded-xl p-4 font-bold outline-none focus:border-blue-500 appearance-none dark:text-white text-xs"
                    >
                      <option value="" disabled>اختر مرحلتك</option>
                      {Object.values(Grade).map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-gray-700 dark:text-gray-300 font-black text-xs ml-2">التخصص الدراسي</label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.education ? (isAzhar 
                      ? [Specialty.SC_AZHAR, Specialty.LITERARY] 
                      : [Specialty.SC_BIO, Specialty.SC_MATH, Specialty.LITERARY]
                    ) : []).map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => setFormData({...formData, specialty: spec})}
                        className={`px-6 py-3 rounded-full border-2 font-black text-[10px] transition-all ${
                          formData.specialty === spec 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg' 
                          : 'border-gray-100 dark:border-slate-800 text-gray-400'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-[0_20px_40px_-12px_rgba(37,99,235,0.4)] hover:bg-blue-700 active:scale-95 transition-all mt-6 flex items-center justify-center gap-3 group ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'جاري التحقق...' : mode === 'login' ? 'تأكيد الدخول' : 'تأكيد الحساب 🚀'}
              {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-[-4px] transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;