import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Clock, List, BarChart3, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/exercises', icon: <Dumbbell size={24} />, label: 'Exercises' },
    { path: '/builder', icon: <List size={24} />, label: 'Builder' },
    { path: '/timer', icon: <Clock size={24} />, label: 'Timer' },
    { path: '/diary', icon: <BarChart3 size={24} />, label: 'Diary' },
    { path: '/profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-3 px-2 transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
                }`
              }
            >
              <div className="mb-1">{item.icon}</div>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;