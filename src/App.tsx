import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import DashboardP001 from './pages/DashboardP001';
import DashboardP002 from './pages/DashboardP002';
import DashboardP003 from './pages/DashboardP003';
import DashboardP004 from './pages/DashboardP004';
import DashboardP005 from './pages/DashboardP005';
import { 
  Home, 
  BarChart2, 
  Layers, 
  ShieldAlert, 
  FolderGit, 
  CloudSun, 
  User, 
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('P001');
  const [time, setTime] = useState(new Date());
  const [scale, setScale] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scaleX = width / 1920;
      const scaleY = height / 1080;
      setScale({ x: scaleX, y: scaleY });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'P001', label: '首页', icon: <Home size={18} /> },
    { id: 'P002', label: '数字孪生', icon: <Layers size={18} /> },
    { id: 'P003', label: '资源运营', icon: <BarChart2 size={18} /> },
    { id: 'P005', label: '运维监控', icon: <ShieldAlert size={18} /> },
    { id: 'P004', label: '智算中心', icon: <FolderGit size={18} /> },
  ];

  const getWeekDay = (date: Date) => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
  };

  const formatDateTime = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  };

  return (
    <div className="w-screen h-screen bg-[#010614] overflow-hidden relative">
      <div 
        className="w-[1920px] h-[1080px] shrink-0 text-slate-200 relative flex flex-col origin-top-left absolute top-0 left-0"
        style={{ 
          transform: `scale(${scale.x}, ${scale.y})`,
          background: 'radial-gradient(circle at center, #071c35 0%, #02091c 65%, #010614 100%)'
        }}
      >
        {/* Top Header */}
        <header className="h-[104px] w-full flex flex-col justify-between px-8 pt-4 pb-2 relative z-20 bg-[#020a1c]">
          {/* Row 1: Logo, Title, Widgets */}
          <div className="w-full flex items-center justify-between">
            {/* Logo area */}
            <div className="flex items-center space-x-2.5 w-1/3">
              <div className="w-7 h-7 rounded-full bg-[#00D4FF] flex items-center justify-center shadow-[0_0_8px_rgba(0,212,255,0.7)]">
                <div className="w-2.5 h-2.5 flex justify-between">
                  <div className="w-[2px] h-full bg-[#020a1c] rounded-xs"></div>
                  <div className="w-[2px] h-full bg-[#020a1c] rounded-xs"></div>
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-wider font-sans">IDC数字运营平台</span>
            </div>
            
            {/* Title area */}
            <div className="w-1/3 flex justify-center items-center">
              {/* Left Wing */}
              <div className="flex items-center space-x-1 opacity-60 mr-4">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#00D4FF]" />
                <span className="text-[#00D4FF] text-[10px]">◀</span>
              </div>
              <h1 className="text-[30px] font-bold text-white tracking-widest text-shadow-glow uppercase font-sans italic" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.6)' }}>
                {currentPage === 'P002' ? 'IDC 数字孪生平台' : 'IDC 运营驾驶舱'}
              </h1>
              {/* Right Wing */}
              <div className="flex items-center space-x-1 opacity-60 ml-4">
                <span className="text-[#00D4FF] text-[10px]">▶</span>
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#00D4FF]" />
              </div>
            </div>

            {/* Widgets area */}
            <div className="w-1/3 flex items-center justify-end space-x-6">
              {/* Date & Time */}
              <div className="text-right font-mono">
                <div className="text-[14px] font-medium text-slate-200 leading-tight">{formatDateTime(time)}</div>
                <div className="text-[11px] text-slate-400 leading-tight">{getWeekDay(time)}</div>
              </div>

              {/* Weather */}
              <div className="flex items-center space-x-2 text-slate-300 font-sans border-l border-slate-700 pl-4 h-7">
                <CloudSun className="text-[#00D4FF] w-4.5 h-4.5" />
                <span className="text-[13px]">23°C</span>
                <span className="text-[11px] text-brand-success bg-brand-success/10 px-1.5 py-0.5 rounded border border-brand-success/20">空气优</span>
              </div>

              {/* User Dropdown */}
              <div className="flex items-center space-x-2 text-slate-300 font-sans border-l border-slate-700 pl-4 h-7 cursor-pointer hover:text-white">
                <div className="w-6 h-6 rounded-full bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
                  <User size={13} />
                </div>
                <span className="text-[13px]">管理员</span>
                <ChevronDown size={13} className="text-slate-400" />
              </div>

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen} 
                className="flex items-center justify-center text-slate-300 hover:text-white border-l border-slate-700 pl-4 h-7 cursor-pointer"
                title={isFullscreen ? "退出全屏" : "全屏显示"}
              >
                {isFullscreen ? <Minimize2 size={16} className="text-brand-primary animate-pulse" /> : <Maximize2 size={16} className="text-brand-primary hover:scale-110 transition-transform" />}
              </button>
            </div>
          </div>

          {/* Row 2: Slanted Parallelogram Tabs */}
          <div className="w-full flex justify-center mt-2.5 mb-1">
            <div className="flex space-x-2.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`relative px-7 py-1 transition-all duration-300 transform skew-x-[-22deg] ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#0066FF] to-[#00D4FF]/85 text-white font-bold border-b-[2px] border-[#00D4FF] shadow-[0_3px_10px_rgba(0,102,255,0.4)]' 
                        : 'bg-[#030d26]/40 text-slate-400 hover:text-white hover:bg-[#030d26]/80 border border-[#00d4ff]/10'
                    }`}
                  >
                    <div className="transform skew-x-[22deg] flex items-center space-x-2">
                      <span className={`${isActive ? 'text-white' : 'text-[#00d4ff]'}`}>{item.icon}</span>
                      <span className="text-[13px] tracking-wide whitespace-nowrap">{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full p-6 relative z-10 overflow-hidden">
          {currentPage === 'P001' && <DashboardP001 />}
          {currentPage === 'P002' && <DashboardP002 />}
          {currentPage === 'P003' && <DashboardP003 />}
          {currentPage === 'P004' && <DashboardP004 />}
          {currentPage === 'P005' && <DashboardP005 />}
        </main>

        {/* Background Grid/Lines */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]" 
             style={{ backgroundImage: 'linear-gradient(rgba(0, 212, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.15) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
        </div>
      </div>
    </div>
  );
}
