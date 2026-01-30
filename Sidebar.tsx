import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MAIIcon from './MAIIcon';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'ai', label: 'المساعد الذكي', icon: MAIIcon },
    { id: 'planner', label: 'جدول المذاكرة', icon: Calendar },
    { id: 'religious', label: 'الجانب الإيماني', icon: Heart },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 shadow-sm h-full transition-colors order-last">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <MAIIcon size={32} className="text-blue-600" />
          <h1 className="text-3xl font-black text-blue-600 tracking-tighter italic">MR AI</h1>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-bold">للمستقبل نُعدّك</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all duration-200 ${
                currentPage === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600'
              }`}
            >
              <Icon size={22} />
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.grade}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;