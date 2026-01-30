import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import AIChat from './pages/AIChat';
import Planner from './pages/Planner';
import Religious from './pages/Religious';
import Settings from './pages/Settings';
import WeeklyModal from './components/WeeklyModal';
import MAIIcon from './components/MAIIcon';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showWeeklyMessage, setShowWeeklyMessage] = useState(false);

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', handleTouch, { passive: false });

    if (user && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('تم تفعيل التنبيهات الذكية ✨', {
              body: 'سنقوم بتذكيرك بمواعيد مذاكرتك قبل البدء بـ 10 دقائق.',
              icon: 'https://cdn-icons-png.flaticon.com/512/3413/3413535.png'
            });
          }
        });
      }
    }

    return () => document.removeEventListener('touchstart', handleTouch);
  }, [user]);

  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 0) {
      const lastShown = localStorage.getItem('mr_weekly_shown');
      const todayStr = today.toISOString().split('T')[0];
      if (lastShown !== todayStr) {
        setShowWeeklyMessage(true);
      }
    }
  }, []);

  const handleWeeklyClose = (feedback: string) => {
    localStorage.setItem('mr_weekly_shown', new Date().toISOString().split('T')[0]);
    setShowWeeklyMessage(false);
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-6">
          <MAIIcon size={64} className="text-blue-600 animate-bounce" />
          <div className="absolute inset-0 blur-3xl bg-blue-400/20 animate-pulse"></div>
        </div>
        <h2 className="text-3xl font-black text-blue-900 dark:text-blue-400 mb-2 italic tracking-tighter uppercase">MR AI</h2>
        <p className="font-bold text-gray-500 dark:text-gray-500 animate-pulse">جاري تحضير بيئة المذاكرة الذكية...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard setPage={setCurrentPage} />;
      case 'ai': return <AIChat />;
      case 'planner': return <Planner />;
      case 'religious': return <Religious />;
      case 'settings': return <Settings />;
      default: return <Dashboard setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden relative transition-colors duration-500">
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-36 md:pb-8 touch-pan-y scroll-smooth">
        <div key={currentPage} className="max-w-7xl mx-auto page-transition">
          {renderPage()}
        </div>
      </main>

      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />

      <MobileNav currentPage={currentPage} setPage={setCurrentPage} />
      
      {showWeeklyMessage && <WeeklyModal onClose={handleWeeklyClose} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;