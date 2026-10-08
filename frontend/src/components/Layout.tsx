import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Home, PlaySquare, History, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const bottomNavItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Analyze', path: '/analyze', icon: <PlaySquare size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-16 md:pb-0 overflow-y-auto h-screen relative z-10">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around p-3 z-50">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center space-y-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {item.icon}
              <span className="text-[10px]">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Layout;
