
import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Calendar, 
  Heart, 
  Settings 
} from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  setPage: (page: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentPage, setPage }) => {
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'ai', label: 'الذكاء', icon: Bot },
    { id: 'planner', label: 'جدولي', icon: Calendar },
    { id: 'religious', label: 'إيماني', icon: Heart },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2.2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex justify-around items-center p-2 pointer-events-auto ring-1 ring-black/5">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 transition-all duration-300 ease-in-out active:scale-90 ${
                isActive ? 'flex-[1.4]' : 'flex-1'
              }`}
            >
              <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-2' 
                  : 'text-gray-400 dark:text-gray-500 hover:text-blue-400'
              }`}>
                <item.icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Active Indicator Glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[9px] font-black mt-1 transition-all duration-300 ${
                isActive 
                  ? 'opacity-100 translate-y-[-4px] text-blue-600 dark:text-blue-400' 
                  : 'opacity-0 translate-y-2'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      {/* Safe area padding for iPhones with Home Indicator */}
      <div className="h-2 w-full"></div>
    </div>
  );
};

export default MobileNav;
