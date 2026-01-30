
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calendar as CalendarIcon, Plus, CheckCircle2, Circle, Trash2, X, Clock, Loader2, Bell, BellOff, BellRing } from 'lucide-react';
import { StudyTask } from '../types';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

const Planner: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  const [newTask, setNewTask] = useState({
    subject: '',
    duration: 60,
    day: 'السبت',
    startTime: '10:00',
    reminderEnabled: true
  });

  // Request notification permissions on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(setNotificationPermission);
      }
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      setIsSyncing(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });
      
      if (data && !error) {
        setTasks(data.map(t => ({
          id: t.id.toString(),
          subject: t.subject,
          duration: t.duration,
          day: t.day,
          startTime: t.start_time,
          completed: t.completed,
          reminderEnabled: t.reminder_enabled ?? false
        })));
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reminder Logic: Check every minute for upcoming tasks
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentDayArabic = days[(now.getDay() + 1) % 7]; // Adjustment for Arabic week starting Saturday (roughly)
      // Actually simpler: map JS getDay (0=Sun, 1=Mon...) to our array
      const jsDayToArabic = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const todayName = jsDayToArabic[now.getDay()];

      const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:MM"
      
      tasks.forEach(task => {
        if (!task.completed && task.reminderEnabled && task.day === todayName && task.startTime) {
          const [taskH, taskM] = task.startTime.split(':').map(Number);
          const taskDate = new Date();
          taskDate.setHours(taskH, taskM, 0, 0);

          const diffMinutes = (taskDate.getTime() - now.getTime()) / 60000;

          // Notify if task starts in 10 minutes or less, but not if it already started
          if (diffMinutes > 0 && diffMinutes <= 10 && !notifiedTasksRef.current.has(task.id)) {
            new Notification(`تذكير بموعد المذاكرة: ${task.subject}`, {
              body: `سيبدأ درس ${task.subject} خلال ${Math.round(diffMinutes)} دقائق (${formatTime(task.startTime)})`,
              icon: '/favicon.ico'
            });
            notifiedTasksRef.current.add(task.id);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Initial check
    return () => clearInterval(interval);
  }, [tasks]);

  const toggleTask = async (task: StudyTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !task.completed } : t));
    try {
      await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id);
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
    }
  };

  const toggleReminder = async (e: React.MouseEvent, task: StudyTask) => {
    e.stopPropagation();
    const newStatus = !task.reminderEnabled;
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, reminderEnabled: newStatus } : t));
    try {
      await supabase
        .from('tasks')
        .update({ reminder_enabled: newStatus })
        .eq('id', task.id);
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, reminderEnabled: !newStatus } : t));
    }
  };

  const deleteTask = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await supabase.from('tasks').delete().eq('id', id);
    } catch (err) {
      setTasks(originalTasks);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.subject.trim() || !user) return;

    const tempId = `temp-${Date.now()}`;
    const taskData = {
      user_id: user.id, 
      subject: newTask.subject,
      duration: newTask.duration,
      day: newTask.day,
      start_time: newTask.startTime,
      completed: false,
      reminder_enabled: newTask.reminderEnabled
    };

    const optimisticTask: StudyTask = { 
      id: tempId,
      subject: taskData.subject,
      duration: taskData.duration,
      day: taskData.day,
      startTime: taskData.start_time,
      completed: taskData.completed,
      reminderEnabled: taskData.reminder_enabled
    };

    setTasks(prev => [...prev, optimisticTask]);
    setIsModalOpen(false);
    setNewTask({ ...newTask, subject: '', duration: 60 });

    try {
      const { data, error } = await supabase.from('tasks').insert([taskData]).select();
      if (data && data[0]) {
        setTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: data[0].id.toString() } : t));
      } else if (error) {
        throw error;
      }
    } catch (err) {
      console.error("Failed to add task:", err);
      setTasks(prev => prev.filter(t => t.id !== tempId));
      alert("عذراً، تعذر حفظ المهمة. تأكد من اتصال الإنترنت.");
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    try {
      const [hours, mins] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'م' : 'ص';
      const displayH = h % 12 || 12;
      return `${displayH}:${mins} ${ampm}`;
    } catch (e) { return time; }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">جدول المذاكرة 📅</h2>
            {isSyncing && <Loader2 size={18} className="text-blue-500 animate-spin" />}
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold italic">ابدأ المذاكرة الآن، يتم حفظ تذكيراتك ومهامك تلقائياً.</p>
          {notificationPermission === 'denied' && (
            <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
              <BellOff size={12} /> التنبيهات معطلة في المتصفح. يرجى تفعيلها لاستلام التذكيرات.
            </p>
          )}
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>إضافة مهمة جديدة</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {days.map((day) => {
          const dayTasks = tasks.filter(t => t.day === day);
          return (
            <div key={day} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col min-h-[300px] transition-all hover:border-blue-200">
              <h3 className="text-center font-black text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-gray-50 dark:border-slate-800 flex items-center justify-center gap-2">
                {day}
                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  {dayTasks.length}
                </span>
              </h3>
              <div className="space-y-3 flex-1">
                {dayTasks.map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md relative group/item ${
                      task.completed 
                      ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800 text-green-700 dark:text-green-400' 
                      : 'bg-gray-50 border-gray-100 dark:bg-slate-800/50 dark:border-slate-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black opacity-60 flex items-center gap-1">
                        <Clock size={10} /> {formatTime(task.startTime)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => toggleReminder(e, task)}
                          className={`p-1 rounded-md transition-colors ${task.reminderEnabled ? 'text-blue-600 bg-blue-100/50' : 'text-gray-300 hover:text-blue-400'}`}
                          title={task.reminderEnabled ? "التذكير مفعل" : "تفعيل التذكير"}
                        >
                          {task.reminderEnabled ? <BellRing size={12} /> : <Bell size={12} />}
                        </button>
                        <button 
                          onClick={(e) => deleteTask(e, task.id)}
                          className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 shrink-0">
                        {task.completed ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-gray-300" />}
                      </div>
                      <p className={`text-xs font-bold leading-tight ${task.completed ? 'line-through opacity-50' : ''}`}>
                        {task.subject}
                      </p>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    setNewTask(prev => ({ ...prev, day: day }));
                    setIsModalOpen(true);
                  }}
                  className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-xl text-gray-300 hover:border-blue-200 hover:text-blue-400 transition-all flex items-center justify-center gap-1 mt-auto"
                >
                  <Plus size={16} />
                  <span className="text-[10px] font-black">أضف للـ{day}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">إضافة مهمة جديدة</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={addTask} className="p-8 space-y-5">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-black mb-2">اسم المادة أو الدرس</label>
                <input 
                  autoFocus
                  type="text"
                  required
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  placeholder="مثال: فيزياء - قوانين نيوتن"
                  className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-2xl p-4 font-bold outline-none focus:ring-4 focus:ring-blue-100 dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-black mb-2">اليوم</label>
                  <select 
                    value={newTask.day}
                    onChange={(e) => setNewTask({...newTask, day: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-2xl p-4 font-bold outline-none dark:text-white transition-all"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-black mb-2">الوقت</label>
                  <input 
                    type="time"
                    required
                    value={newTask.startTime}
                    onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-2xl p-4 font-bold outline-none dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700 cursor-pointer" onClick={() => setNewTask(prev => ({...prev, reminderEnabled: !prev.reminderEnabled}))}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newTask.reminderEnabled ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {newTask.reminderEnabled ? <BellRing size={20} /> : <BellOff size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black dark:text-white">تفعيل التذكير الذكي</p>
                  <p className="text-[10px] text-gray-500 font-bold">سنقوم بتنبيهك قبل الموعد بـ 10 دقائق</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative p-1 transition-all ${newTask.reminderEnabled ? 'bg-blue-100' : 'bg-gray-300'}`}>
                   <div className={`w-4 h-4 rounded-full shadow-sm transition-all bg-white absolute ${newTask.reminderEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                تأكيد الإضافة
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
