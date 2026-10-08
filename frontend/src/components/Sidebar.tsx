import { Link, useLocation } from 'react-router-dom';
import { Home, PlaySquare, History, FileText, Info } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Analyze', path: '/analyze', icon: <PlaySquare size={20} /> },
    { name: 'History', path: '/history', icon: <History size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Methodology', path: '/methodology', icon: <Info size={20} /> },
  ];

  return (
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0 hidden md:flex z-50 bg-[#283618] text-[#FEFAE0]">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-[28px] font-bold tracking-tight text-[#FEFAE0]">DeepShield</h1>
        <p className="text-[11px] uppercase font-semibold tracking-widest text-white/60 mt-1">Multimodal Forensics</p>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${isActive ? 'bg-[#606C38] text-[#FEFAE0] font-semibold' : 'text-[#FEFAE0]/70 hover:bg-white/5 hover:text-[#FEFAE0]'}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#DDA15E] rounded-r-full"></div>
              )}
              <div className="transition-transform duration-200">
                {item.icon}
              </div>
              <span className="text-[14px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-white/10">
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-white/50 mb-1">SYSTEM STATUS</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#606C38]"></div>
              <div className="text-[12px] font-medium text-[#FEFAE0]">Online</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-white/50">
            <div>Backend: <span className="text-white/80">Active</span></div>
            <div>Model: <span className="text-white/80">Ready</span></div>
            <div>Database: <span className="text-white/80">Connected</span></div>
            <div>Version: <span className="text-white/80">2.1.0</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
