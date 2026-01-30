import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, EducationType, Grade, Specialty } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  loginByName: (name: string) => Promise<void>;
  register: (name: string, education: EducationType, grade: Grade, specialty: Specialty) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mr_ai_user_profile';

const normalizeArabic = (text: string): string => {
  if (!text) return "";
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const mapProfileData = (data: any): UserProfile => ({
    id: data.id,
    name: data.name,
    educationType: data.education_type as EducationType,
    grade: data.grade as Grade,
    specialty: data.specialty as Specialty,
    trialStartDate: data.created_at || new Date().toISOString(),
    referralCount: data.referral_count || 0,
    studyHours: data.study_hours || 0,
    completedLessons: data.completed_lessons || [],
  });

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data && !error) {
        const profile = mapProfileData(data);
        setUser(profile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        return profile;
      }
      return null;
    } catch (err) {
      console.error("Fetch profile error:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchProfile(session.user.id);
        } else {
          // محاولة استعادة الجلسة من التخزين المحلي كخيار احتياطي
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            setUser(JSON.parse(saved));
          }
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchProfile]);

  const loginByName = async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("يرجى إدخال اسمك");

    // البحث عن البروفايل بالاسم أولاً دون الحاجة لتسجيل دخول
    const normalizedInput = normalizeArabic(cleanName);
    
    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('*');

    if (searchError) throw new Error("حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.");

    const existingProfile = profiles?.find(p => normalizeArabic(p.name) === normalizedInput);

    if (!existingProfile) {
      throw new Error("لم نجد حساباً بهذا الاسم. هل قمت بإنشاء حساب جديد؟");
    }

    // تسجيل دخول مجهول (Anonymous) للحصول على توكن صالح للعمليات اللاحقة
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) throw authError;

    const newAuthId = authData.user!.id;

    // ملاحظة: لا يمكننا تغيير المفتاح الأساسي (id) بسهولة في سوبابيز إذا كان مرتبطاً بـ auth.users
    // لذا سنقوم بنقل البيانات من الهوية القديمة للجديدة أو ببساطة تحديث سجل البروفايل بالاسم
    // الحل الأبسط لهذا السيناريو التعليمي هو تحديث حقل الـ id ليتوافق مع الـ Auth ID الجديد
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ id: newAuthId })
      .eq('name', existingProfile.name);

    if (updateError) {
      console.error("Update ID error:", updateError);
      // إذا فشل التحديث (بسبب قيود PK)، سنعتمد على البروفايل الموجود ونخزنه محلياً
      const profile = mapProfileData(existingProfile);
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return;
    }

    await fetchProfile(newAuthId);
  };

  const register = async (name: string, education: EducationType, grade: Grade, specialty: Specialty) => {
    const cleanName = name.trim();
    if (cleanName.length < 3) throw new Error("الاسم يجب أن يكون 3 أحرف على الأقل.");

    const { data: existingProfiles } = await supabase.from('profiles').select('name');
    if (existingProfiles?.some(p => normalizeArabic(p.name) === normalizeArabic(cleanName))) {
      throw new Error("هذا الاسم مسجل بالفعل! يرجى استخدام تسجيل الدخول.");
    }

    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    if (authError) throw authError;

    const userId = authData.user!.id;
    const { error: insertError } = await supabase.from('profiles').insert([{
      id: userId,
      name: cleanName,
      education_type: education,
      grade: grade,
      specialty: specialty
    }]);

    if (insertError) {
      console.error("Insert profile error:", insertError);
      await supabase.auth.signOut();
      throw new Error("فشل إنشاء الحساب. يرجى التأكد من اتصال الإنترنت.");
    }

    await fetchProfile(userId);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Supabase signOut error", e);
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    const { error } = await supabase.from('profiles').update({
      name: updates.name,
      education_type: updates.educationType,
      grade: updates.grade,
      specialty: updates.specialty,
      study_hours: updates.studyHours,
      completed_lessons: updates.completedLessons
    }).eq('id', user.id);
    
    if (!error) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginByName, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};