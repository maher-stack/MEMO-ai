
import { EducationType, Grade, Specialty } from '../types';

export interface BookItem {
  id: string;
  title: string;
  subject: string;
  image: string;
  education: EducationType;
  grade: Grade;
  specialty: Specialty[];
  year: string;
}

const subjects = [
  'الفيزياء', 'الكيمياء', 'الأحياء', 'الرياضيات البحته', 'الميكانيكا', 
  'اللغة العربية', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'التاريخ', 
  'الجغرافيا', 'الفلسفة', 'علم النفس', 'الجيولوجيا', 'التربية الدينية', 
  'القرآن الكريم', 'الفقه', 'التوحيد', 'التفسير', 'الحديث', 'المنطق'
];

export const generateBooks = (): BookItem[] => {
  const books: BookItem[] = [];
  let idCounter = 1;

  Object.values(Grade).forEach(grade => {
    Object.values(EducationType).forEach(edu => {
      subjects.forEach(subject => {
        // Simple logic to assign specialties
        const specs: Specialty[] = [];
        if (subject === 'الفيزياء' || subject === 'الكيمياء') {
          specs.push(Specialty.SC_BIO, Specialty.SC_MATH, Specialty.SC_AZHAR);
        } else if (subject === 'التاريخ' || subject === 'الجغرافيا') {
          specs.push(Specialty.LITERARY);
        } else if (['الفقه', 'القرآن الكريم', 'التوحيد'].includes(subject)) {
          if (edu === EducationType.AZHAR) specs.push(Specialty.SC_AZHAR, Specialty.LITERARY);
          else return; // Skip religious subjects for general unless it's basic
        } else {
          specs.push(Specialty.SC_BIO, Specialty.SC_MATH, Specialty.LITERARY, Specialty.SC_AZHAR);
        }

        if (specs.length > 0) {
          books.push({
            id: `book-${idCounter++}`,
            title: `${subject} - ${grade}`,
            subject,
            image: `https://picsum.photos/400/600?random=${idCounter}`,
            education: edu,
            grade,
            specialty: specs,
            year: '2024/2025'
          });
        }
      });
    });
  });

  return books;
};

export const allBooks = generateBooks();
