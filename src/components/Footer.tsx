import React from 'react';
import { Cpu, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import LogoUrl from '../assets/images/electro_kb_logo_1780929742804.png';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer id="app-footer" className="relative bg-slate-950 border-t border-emerald-950/40 pt-16 pb-8 px-4 md:px-8 mt-20">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-right mb-12 relative z-10">
        
        {/* Branch brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/30 p-0.5 shadow-md">
              <img src={LogoUrl} alt="Electro KB Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none">إلكترو <span className="text-emerald-400 font-mono">KB</span></h2>
              <span className="text-[9px] text-slate-500 font-semibold block">مبيعات وصيانة الأجهزة والتقنيات</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            المنصة والوجهة الرائدة لعرض وتوفير الهواتف المحمولة الذكية بالجزائر، الحواسيب المحمولة الراقية، وكل إكسسواراتها، بالإضافة إلى ورشة الصيانة المتكاملة لجميع الأعطاب الفنية بإشراف مختصينا بضمان شامل وقطع غيار أصلية.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>معتمد بنطاق الجودة الكاملة والقطع الأصلية 4.9⭐</span>
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider relative inline-block pb-1.5 border-b border-emerald-500/30">
            تصفح القائمة السريعة
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 hover:underline cursor-pointer">
                الرئيسية
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('store')} className="hover:text-emerald-400 hover:underline cursor-pointer">
                معرض الأجهزة ومستلزمات التقنية
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('repair')} className="hover:text-emerald-400 hover:underline cursor-pointer">
                طلب إصلاح وصيانة الأجهزة
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('track')} className="hover:text-emerald-400 hover:underline cursor-pointer">
                تتبع حالة جهازك المحجوز لدينا
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-400 hover:underline cursor-pointer">
                بوابة الإدارة الرقمية للفنيين
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info info */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider relative inline-block pb-1.5 border-b border-emerald-500/30">
            قنوات الاتصال المباشرة
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-400">
            <li className="flex items-center justify-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>الجزائر العاصمة، حي السعيد حمدين، عمارة 5B</span>
            </li>
            <li className="flex items-center justify-start gap-2.5 font-mono text-[11px]">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="select-all">+213 555 12 34 56</span>
            </li>
            <li className="flex items-center justify-start gap-2.5 font-mono">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="select-all">repair@electrotech.com</span>
            </li>
          </ul>
        </div>

        {/* Opening hours info */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider relative inline-block pb-1.5 border-b border-emerald-500/30">
            أوقات العمل وفحص الورشة
          </h3>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start justify-start gap-2.5">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">السبت إلى الخميس:</strong>
                <span>09:00 صباحاً - 08:00 مساءً</span>
              </div>
            </li>
            <li className="flex items-start justify-start gap-2.5">
              <Clock className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">يوم الجمعة:</strong>
                <span>مغلق (للقيام بـ صيانة الأجهزة المتراكمة)</span>
              </div>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} إلكترو صيانة. كافة الحقوق محفوظة ومحمية.</span>
        <span className="flex items-center gap-1">
          بني بكل حب <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> من أجل صيانة تقنية مستدامة.
        </span>
      </div>
    </footer>
  );
};
