import React from 'react';
import { Sparkles, ShieldCheck, Wrench, ArrowLeft, Star, Monitor, Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import LogoUrl from '../assets/images/electro_kb_logo_1780929742804.png';

interface HeroSectionProps {
  setActiveTab: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setActiveTab }) => {
  return (
    <div id="hero-section" className="relative overflow-hidden py-12 md:py-20 lg:py-24 grid-bg">
      {/* Decorative Cyber Glowing Orbs (like bg.png) */}
      <div className="absolute top-1/4 right-0 w-72 h-72 md:w-96 md:h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Pitch content */}
        <div className="space-y-6 md:space-y-8 text-right self-center z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Electro KB - المعرض الرسمي المعتمد ومركز الصيانة الشامل</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            جهازك بحاجة لإصلاح؟ <br />
            أو تبحث عن
            <span className="bg-gradient-to-l from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent px-2 font-black">
              جهاز مضمون؟
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-xl leading-relaxed">
            مرحباً بك في منصة <strong className="text-emerald-400">إلكترو KB</strong> المتكاملة بالجزائر. نوفر لك تصفح وشراء أفضل كتالوج للهواتف الذكية الراقية، الحواسيب الممتازة، مع ورشة صيانة دقيقة مجهزة بميكروسكوبات وأحدث أدوات اللحام لتبديل الشاشات واللوحة الأم بـ قطع غيار أصلية بضمان حقيقي.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setActiveTab('repair')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black hover:opacity-95 shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer text-base"
            >
              <Wrench className="w-5 h-5 flex-shrink-0 text-slate-950" />
              <span>اطلب إصلاح جهازك الآن</span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900/85 text-white font-bold hover:bg-slate-800 border border-emerald-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer text-base"
            >
              <span>تصفح كتالوج الأجهزة المتوفرة</span>
              <ArrowLeft className="w-5 h-5 mr-1 text-emerald-400" />
            </button>
          </div>

          {/* Core Guarantees Icons List */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-right">
            <div className="p-3 border border-emerald-500/10 rounded-2xl bg-emerald-950/20 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2 mr-0" />
              <h3 className="font-bold text-sm text-slate-100">ضمان شامل</h3>
              <p className="text-[11px] text-slate-400">على كل المبيعات والقطع المستبدلة</p>
            </div>
            <div className="p-3 border border-emerald-500/10 rounded-2xl bg-emerald-950/20 backdrop-blur-sm">
              <Wrench className="w-6 h-6 text-cyan-400 mb-2 mr-0" />
              <h3 className="font-bold text-sm text-slate-100">فحص مجهري</h3>
              <p className="text-[11px] text-slate-400">تشخيص دقيق وحلول صيانة جذرية</p>
            </div>
            <div className="p-3 border border-emerald-500/10 rounded-2xl bg-emerald-950/20 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-amber-500 mb-2 mr-0" />
              <h3 className="font-bold text-sm text-slate-100">تتبع حي</h3>
              <p className="text-[11px] text-slate-400">اطلع على تقارير الفني والأسعار حياً</p>
            </div>
          </div>
        </div>

        {/* Visual Graphic Representation showing the NEW LOGO inside Cyber Ring */}
        <div className="flex justify-center items-center relative py-10 z-10">
          <div className="relative w-full max-w-sm aspect-square bg-slate-950/60 rounded-[36px] border border-emerald-500/30 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Ambient cyber lights (like bg.png) */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl filter pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl filter pointer-events-none" />
            
            {/* Cyber Grid Lines Overlay */}
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

            {/* Top decorative bar */}
            <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-900" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">EKB_SECURE_PLATFORM</span>
            </div>

            {/* Display the newly generated Electro KB Logo in state of the art presentation */}
            <div className="my-auto flex flex-col items-center justify-center space-y-4 py-4">
              <div className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/20 group hover:rotate-2 transition duration-300">
                <img src={LogoUrl} alt="Electro KB Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-black text-slate-100 flex items-center justify-center gap-1">
                  <span>شعار الهوية الرقمية الرسمية لـ إلكترو KB</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">تصميم مدمج بالخلفية الفضائية المظلمة والمشعة</p>
              </div>
            </div>

            {/* Bottom mini telemetry */}
            <div className="border-t border-emerald-500/10 pt-4 flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span className="text-emerald-400 font-bold">STATUS: WORKSHOP ON</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

