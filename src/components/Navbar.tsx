import React from 'react';
import { Smartphone, Laptop, Wrench, ShieldCheck, Cpu, LayoutDashboard } from 'lucide-react';
import LogoUrl from '../assets/images/electro_kb_logo_1780929742804.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAdminLoggedIn,
  onLogoutAdmin
}) => {
  return (
    <nav id="app-navbar" className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-emerald-950/40 px-4 md:px-8 py-3.5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 p-0.5 shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
            <img src={LogoUrl} alt="Electro KB" className="w-full h-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent pointer-events-none" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-l from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent flex items-center gap-1.5 font-sans">
              إلكترو <span className="text-emerald-400 font-black font-mono">KB</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">بوابة الأجهزة الذكية والصيانة الاحترافية</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          <button
            id="nav-btn-home"
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 text-emerald-400 border border-emerald-500/30 glow-emerald'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            الرئيسية
          </button>

          <button
            id="nav-btn-store"
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
              activeTab === 'store'
                ? 'bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 text-emerald-400 border border-emerald-500/30 glow-emerald'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            المعرض والمتجر
          </button>

          <button
            id="nav-btn-repair"
            onClick={() => setActiveTab('repair')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
              activeTab === 'repair'
                ? 'bg-gradient-to-r from-emerald-950 to-cyan-950 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-300 hover:text-white hover:bg-emerald-950/20 hover:text-emerald-400'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-400 animate-pulse" />
            إصلاح وصيانة الأجهزة
          </button>

          <button
            id="nav-btn-test"
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
              activeTab === 'track'
                ? 'bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 text-emerald-400 border border-emerald-500/30 glow-emerald'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            تتبع طلبك
          </button>

          <button
            id="nav-btn-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
              activeTab === 'admin'
                ? 'bg-purple-950 text-purple-300 border border-purple-800/40 shadow-lg shadow-purple-500/10'
                : 'text-slate-400 hover:text-white hover:bg-purple-950/20'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            {isAdminLoggedIn ? 'لوحة الإدارة (نشط)' : 'بوابة الإدارة'}
          </button>
        </div>

        {/* Quality Badges */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/20 border border-emerald-500/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>قطع غيار أصلية 100%</span>
          </div>
          {isAdminLoggedIn && (
            <button
              onClick={onLogoutAdmin}
              className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 hover:text-white border border-rose-800/40 transition duration-150 cursor-pointer"
            >
              خروج الأدمن
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
