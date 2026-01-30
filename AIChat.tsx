import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Trash2, FileText, HelpCircle, Lightbulb, Zap, XCircle, Paperclip, X, File, Mic } from 'lucide-react';
import { askGemini } from '../services/geminiService';
import { Message } from '../types';
import MAIIcon from '../components/MAIIcon';

type ChatMode = 'general' | 'summary' | 'explanation' | 'test' | 'solution';

interface ModeConfig {
  id: ChatMode;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  borderColor: string;
  placeholder: string;
  instruction: string;
}

const MODES: ModeConfig[] = [
  { 
    id: 'summary', 
    label: 'تلخيص', 
    icon: FileText, 
    color: 'text-green-600', 
    bg: 'bg-green-50', 
    borderColor: 'border-green-200',
    placeholder: 'أدخل النص للتلخيص...',
    instruction: 'أريد تلخيصاً مركزاً لهذا محتوى: '
  },
  { 
    id: 'explanation', 
    label: 'شرح', 
    icon: Lightbulb, 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50', 
    borderColor: 'border-yellow-200',
    placeholder: 'ما هو المفهوم؟',
    instruction: 'اشرح لي هذا المفهوم المرفق ببساطة: '
  },
  { 
    id: 'test', 
    label: 'إختبار', 
    icon: HelpCircle, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50', 
    borderColor: 'border-blue-200',
    placeholder: 'صور الدرس لاختبارك فيه...',
    instruction: 'قم بإنشاء اختبار قصير من 3 أسئلة: '
  },
  { 
    id: 'solution', 
    label: 'حل', 
    icon: Zap, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50', 
    borderColor: 'border-purple-200',
    placeholder: 'صور المسألة الصعبة...',
    instruction: 'ساعدني في حل هذه المسألة خطوة بخطوة: '
  },
];

interface AttachedFile {
  name: string;
  mimeType: string;
  data: string;
  preview?: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'مرحباً بك! أنا معلمك الذكي MR AI. كيف يمكنني مساعدتك في دراستك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentMode, setCurrentMode] = useState<ChatMode>('general');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      const preview = file.type.startsWith('image/') ? (event.target?.result as string) : undefined;
      
      setAttachedFile({
        name: file.name,
        mimeType: file.type,
        data: base64,
        preview
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = async (text: string = input) => {
    if ((!text.trim() && !attachedFile) || isLoading) return;

    const userMsg: Message = { 
      role: 'user', 
      text: attachedFile ? `[ملف: ${attachedFile.name}]\n${text}` : text 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    let finalPrompt = text || (attachedFile ? "اشرح لي محتوى هذا الملف" : "");
    const activeMode = MODES.find(m => m.id === currentMode);
    if (activeMode) {
      finalPrompt = `${activeMode.instruction}\n\n${text}`;
    }

    const filePayload = attachedFile ? { data: attachedFile.data, mimeType: attachedFile.mimeType } : undefined;
    setAttachedFile(null);

    const response = await askGemini(finalPrompt, undefined, filePayload);
    const modelMsg: Message = { role: 'model', text: response };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const patternStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 3c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-46-45c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm54 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM10 54c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm56 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-25 35c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-31-34c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm54-14c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM46 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm20 30c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-9-25c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm34 57c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM20 6c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm70 20c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-32 67c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM9 10c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm66 2c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 33c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 33c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM20 70c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0-33c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0-33c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0 99c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33-99c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM9 100c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm33 0c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%233b82f6' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
    backgroundSize: '150px 150px'
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-full flex flex-col bg-white dark:bg-slate-950 rounded-[2rem] md:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
      <header className="px-5 py-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg relative">
            <MAIIcon size={20} />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h2 className="font-black text-sm italic dark:text-white uppercase tracking-tighter">MR AI</h2>
            <p className="text-[10px] text-green-500 font-black">نشط الآن</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
           <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">
             <Mic size={18} />
           </button>
           <button 
            onClick={() => {
              setMessages([messages[0]]);
              setCurrentMode('general');
              setAttachedFile(null);
            }}
            className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <div className="p-3 bg-white dark:bg-slate-950 border-b border-gray-50 dark:border-slate-900 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-1">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setCurrentMode(currentMode === mode.id ? 'general' : mode.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 whitespace-nowrap font-black text-[10px] transition-all shrink-0 ${
                currentMode === mode.id 
                ? `${mode.bg} ${mode.color} ${mode.borderColor} shadow-sm` 
                : 'bg-white dark:bg-slate-900 text-gray-400 border-gray-100 dark:border-slate-800'
              }`}
            >
              <mode.icon size={14} />
              {mode.label}
              {currentMode === mode.id && <XCircle size={12} className="opacity-50" />}
            </button>
          ))}
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#f0f2f5] dark:bg-[#0b141a] relative"
        style={patternStyle}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <MAIIcon size={14} />}
              </div>
              <div className={`p-3.5 rounded-2xl whitespace-pre-wrap font-bold leading-relaxed text-xs md:text-sm shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10' 
                : 'bg-white dark:bg-[#202c33] text-gray-800 dark:text-[#e9edef] border border-gray-100 dark:border-transparent'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end">
            <div className="flex gap-2 flex-row-reverse items-center">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-blue-600 flex items-center justify-center">
                <MAIIcon size={14} className="animate-spin" />
              </div>
              <div className="px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 rounded-xl text-gray-400 font-black italic text-[10px]">
                جاري التفكير...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-[#202c33] z-10">
        {attachedFile && (
          <div className="mb-3 animate-in slide-in-from-bottom-2 duration-300">
            <div className="inline-flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl relative">
              <button onClick={() => setAttachedFile(null)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-full shadow-lg">
                <X size={10} />
              </button>
              {attachedFile.preview ? (
                <img src={attachedFile.preview} className="w-9 h-9 rounded-lg object-cover" alt="Preview" />
              ) : (
                <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <File size={16} />
                </div>
              )}
              <div className="px-2">
                <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{attachedFile.name}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-400 border border-gray-100 dark:border-slate-700 rounded-xl hover:text-blue-600 active:bg-blue-50"
          >
            <Paperclip size={18} />
          </button>
          
          <div className="flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسأل MR AI..."
              className="w-full bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 border rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-100 outline-none font-black text-xs transition-all dark:text-white"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !attachedFile)}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg active:scale-90"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;