import React, { useState } from 'react';
import { MessageSquare, X, Heart, Star } from 'lucide-react';

interface WeeklyModalProps {
  onClose: (feedback: string) => void;
}

const WeeklyModal: React.FC<WeeklyModalProps> = ({ onClose }) => {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-top-10 duration-500">
        <div className="bg-blue-600 p-8 text-white text-center relative">
          <button 
            onClick={() => onClose('')}
            className="absolute top-4 right-4 text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <MessageSquare size={40} />
          </div>
          <h2 className="text-2xl font-black mb-2">رسالة من أسرة MR AI 💙</h2>
          <p className="opacity-90 font-bold">كيف كانت تجربتك هذا الأسبوع؟</p>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-gray-600 text-center font-semibold leading-relaxed">
            نحن في MR AI نسعى دائماً لتطوير المنصة لتناسب احتياجاتك. رأيك يهمنا جداً لتحسين جودة التعليم!
          </p>
          <div className="flex justify-center gap-4 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={32} className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-125 transition-transform" />
            ))}
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="هل لديك أي اقتراحات أو تعديلات تود رؤيتها في التطبيق؟"
            className="w-full bg-gray-50 border-gray-200 border rounded-2xl p-4 font-bold h-32 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
          />
          <button
            onClick={() => onClose(feedback)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Heart size={20} />
            إرسال Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyModal;