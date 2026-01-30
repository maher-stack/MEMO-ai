import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askGemini(
  prompt: string, 
  context?: string, 
  fileData?: { data: string, mimeType: string }
) {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = `أنت مساعد تعليمي ذكي لمنصة MR AI. 
  مهمتك مساعدة طلاب الثانوية في مصر. 
  السياق الحالي هو محتوى كتاب: ${context || 'منهج الثانوية'}.
  إذا قام الطالب برفع صورة أو ملف، قم بتحليله بدقة (سواء كان سؤالاً، مسألة رياضية، أو نصاً).
  كن دقيقاً، مشجعاً، واستخدم اللغة العربية الفصحى المبسطة.
  يمكنك تقديم شروحات، حلول مسائل، تلخيص، أو إنشاء أسئلة اختبارية.`;

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (fileData) {
      parts.unshift({
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "عذراً، حدث خطأ في معالجة طلبك. يرجى التأكد من اتصال الإنترنت وحجم الملف.";
  }
}

export async function searchLatestCurriculum(educationType: string, grade: string, specialty: string) {
  const prompt = `ابحث عن روابط تحميل كتب المنهج الجديد لعام 2024/2025 لطلاب الثانوية ال${educationType}، الصف ${grade}، تخصص ${specialty} في مصر. 
  أريد قائمة بأسماء الكتب وروابطها الرسمية من موقع وزارة التربية والتعليم أو بوابة الأزهر الإلكترونية.
  رجع النتيجة بتنسيق نصي واضح.`;

  try {
    // استخدام gemini-3-pro-image-preview حصرياً لأدوات البحث جوجل
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      sources: urls
    };
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
}

export async function generateQuiz(subject: string) {
  const prompt = `قم بإنشاء 3 أسئلة اختيار من متعدد صعبة لمادة ${subject} مع ذكر الإجابة الصحيحة لكل سؤال.`;
  return await askGemini(prompt);
}

export async function summarizeContent(content: string) {
  const prompt = `لخص هذا المحتوى التعليمي في نقاط واضحة وأبرز الأخطاء الشائعة التي يقع فيها الطلاب: ${content}`;
  return await askGemini(prompt);
}