
export enum EducationType {
  GENERAL = 'عام',
  AZHAR = 'أزهري'
}

export enum Grade {
  FIRST = 'الأول الثانوي',
  SECOND = 'الثاني الثانوي',
  THIRD = 'الثالث الثانوي'
}

export enum Specialty {
  SC_BIO = 'علمي علوم',
  SC_MATH = 'علمي رياضة',
  LITERARY = 'أدبي',
  SC_AZHAR = 'علمي أزهري'
}

export interface UserProfile {
  id: string;
  name: string;
  educationType: EducationType;
  grade: Grade;
  specialty: Specialty;
  trialStartDate: string;
  referralCount: number;
  studyHours: number;
  completedLessons: string[];
}

export interface Book {
  id: string;
  title: string;
  subject: string;
  cover: string;
  content: string; // Simplified for demo
}

export interface StudyTask {
  id: string;
  subject: string;
  duration: number; // minutes
  day: string;
  startTime?: string; // e.g., "17:00"
  completed: boolean;
  reminderEnabled?: boolean;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
