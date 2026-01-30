import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EducationType, Grade, Specialty } from '../types';
import { 
  User, Shield, Sun, Moon, Save, RefreshCw, 
  CheckCircle2, CheckCircle
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    educationType: user?.educationType || EducationType.GENERAL,
    grade: user?.grade || Grade.THIRD,
    specialty: user?.specialty || Specialty.SC_BIO
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await updateUser({
        name: formData.name,
        educationType: formData.educationType as EducationType,
        grade: formData.grade as Grade,
        specialty: formData.specialty as Specialty
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const isAzhar = formData.educationType === EducationType.AZHAR;
  const availableSpecialties = isAzhar 
    ? [Specialty.SC_AZHAR, Specialty.LITERARY] 
    : [Specialty.SC_BIO, Specialty.SC_MATH, Specialty.LITERARY];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">الإعدادات</h2>
          <p className="text-gray-500 dark:text-gray-400 font-semibold">إدارة حسابك وتفضيلات التطبيق</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <button 
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
          >
            <Sun size={20} />
          </button>
          <button 
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
          >
            <Moon size={20} />
          </button>
        </div>
      </header>

      <div className="space-y-6">
        <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                <User size={24} />
              </div>
              <h3 className="text-xl font-black dark:text-white">تعديل الملف الشخصي</h3>
            </div>
            {saveStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 font-black text-sm animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 size={16} /> تم الحفظ بنجاح
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">الاسم بالكامل</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border-2 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all dark:text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">نوع التعليم</label>
              <select 
                value={formData.educationType}
                onChange={(e) => setFormData({...formData, educationType: e.target.value as EducationType, specialty: '' as any})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border-2 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all dark:text-white"
              >
                {Object.values(EducationType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">المرحلة الدراسية</label>
              <select 
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value as Grade})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border-2 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all dark:text-white"
              >
                {Object.values(Grade).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 mr-2">التخصص</label>
              <select 
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value as Specialty})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border-2 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all dark:text-white"
              >
                {availableSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="mt-8 w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            حفظ التغييرات
          </button>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-lg text-white relative overflow-hidden group">
          <CheckCircle className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black mb-1 flex items-center gap-2">تطبيق MR AI مجاني للأبد <Shield size={18} /></h3>
              <p className="opacity-90 font-bold">أنت تستخدم النسخة الكاملة بدعم من سوبا بيز وجيت هب.</p>
            </div>
            <div className="bg-white/20 px-6 py-2 rounded-full font-black border border-white/30 backdrop-blur-sm">
              الحساب مفعل بنجاح
            </div>
          </div>
        </section>

        <div className="text-center pb-10">
          <p className="text-xs text-gray-400 font-black flex items-center justify-center gap-2">
            صنع بكل حب لدعم الطلاب <span className="text-red-400">❤</span> MR AI Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;