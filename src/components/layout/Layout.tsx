import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import { useAppStore } from '../../store/appStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const darkMode = useAppStore((state) => state.darkMode);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        {children}
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;
