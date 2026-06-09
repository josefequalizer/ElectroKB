import React, { useState } from 'react';
import { RepairRequest, REPAIR_STATUS_LABELS, CATEGORY_LABELS } from '../types';
import { Search, Info, CheckCircle2, Clock, ShieldAlert, Cpu, Hammer, Check, PhoneCall, HelpCircle, FileHeart } from 'lucide-react';

interface TrackRepairProps {
  repairRequests: RepairRequest[];
}

export const TrackRepair: React.FC<TrackRepairProps> = ({ repairRequests }) => {
  const [searchKey, setSearchKey] = useState('');
  const [searchedRequests, setSearchedRequests] = useState<RepairRequest[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    if (!searchKey.trim()) {
      setSearchedRequests([]);
      return;
    }

    // Filter requests matching ID or phone number
    const matched = repairRequests.filter(req => 
      req.id.toLowerCase() === searchKey.trim().toLowerCase() || 
      req.customerPhone.replace(/\s+/g, '').includes(searchKey.trim().replace(/\s+/g, ''))
    );

    setSearchedRequests(matched);
  };

  // List of chronological steps
  const statusSteps = [
    { key: 'pending', title: 'قيد المراجعة والجدولة', desc: 'تم استلام البيانات وجاري مراجعة العطل المكتوب لتعيين فني للغرض.' },
    { key: 'received', title: 'تم استلام الجهاز بالورشة', desc: 'الجهاز وصل رسمياً تحت رعاية مهندسينا ومدرج على طاولة الفحص المجهري.' },
    { key: 'diagnostic', title: 'تحليل الأعطاب والقياسات', desc: 'الفني يفحص اللوحات الدقيقة والمكثفات لتأكيد العيب وحساب التكلفة بدقة.' },
    { key: 'repairing', title: 'العمل على الإصلاح والصيانة', desc: 'جاري تبديل المكونات التالفة أو الشاشة أو البطارية وفق أحدث المعايير التقنية.' },
    { key: 'completed', title: 'جاهز للاستلام والتجربة', desc: 'تمت الصيانة بنجاح واجتاز الجهاز اختبارات الجودة وهو مغلف وجاهز للتسليم.' },
    { key: 'collected', title: 'تم استلام العميل للعملية', desc: 'تم تسليم الجهاز لصاحبه مرفق ببطاقة الضمان الشاملة، شكراً لثقتكم بنا.' },
  ];

  return (
    <section id="track-repair" className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          تتبع حالة أجهزتك في الورشة حياً
        </h2>
        <p className="text-slate-400 text-sm">
          أدخل كود ورمز طلب الصيانة الخاص بك، أو ببساطة اكتب رقم الهاتف الذي سجلت به الطلب لتتعرف على التطورات الفنية، ملاحظات المهندس المسؤول، والخطوة الحالية لجهازك.
        </p>
      </div>

      {/* SEARCH CARD INPUT */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              id="repair-tracker-input"
              type="text"
              required
              placeholder="اكتب رمز طلب الصيانة (مثال: r1) أو رقم جوالك للمطابقة..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="w-full pl-4 pr-11 py-3 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-2xl outline-none text-sm font-mono text-right transition"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/10 cursor-pointer transition flex justify-center items-center gap-1.5"
          >
            <span>بحث وتتبع</span>
          </button>
        </form>
      </div>

      {/* RESULTS BLOCK */}
      {hasSearched && (
        <div className="space-y-8 animate-fade-in text-right">
          {searchedRequests && searchedRequests.length > 0 ? (
            searchedRequests.map(req => {
              // Get indices to compare status progress
              const currentStatusIndex = statusSteps.findIndex(step => step.key === req.status);
              
              return (
                <div key={req.id} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
                  
                  {/* TOP BANNER */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs text-slate-500 font-bold block">الجهاز المتعلق:</span>
                        <h3 className="font-extrabold text-white text-lg">{req.deviceModel}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                          ID: {req.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-start">
                        <span>العميل: <strong className="text-slate-200">{req.customerName}</strong></span>
                        <span className="text-slate-700">|</span>
                        <span>تاريخ تسجيل الدخول: <strong className="text-slate-200 font-mono text-[11px]">{new Date(req.createdAt).toLocaleDateString('ar-EG')}</strong></span>
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-1.5">
                      <span className="text-xs text-slate-500 font-bold">الحالة الإجمالية الحالية</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${REPAIR_STATUS_LABELS[req.status].color}`}>
                        {REPAIR_STATUS_LABELS[req.status].label}
                      </span>
                    </div>
                  </div>

                  {/* DOUBLE COLS TECH SHEET & TIMELINE */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* INFO MATRIX & NOTES */}
                    <div className="md:col-span-5 space-y-6">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-950/80 space-y-3">
                        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-850 pb-2">تفاصيل العطل المشروح للفرع:</h4>
                        <p className="text-xs text-slate-300 leading-relaxed italic">"{req.description}"</p>
                        
                        {req.images && req.images.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] text-slate-500 block mb-1">صور مرفقة أثناء الاستلام:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {req.images.map((img, i) => (
                                <img key={i} src={img} alt="" className="w-12 h-12 rounded object-cover border border-slate-850" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* TECHNICAL ACTION NOTES */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-950/40 space-y-3">
                        <h4 className="text-sm font-bold text-cyan-400 border-b border-slate-850 pb-2">تقرير الفحص وملاحظات الورشة:</h4>
                        {req.adminNotes ? (
                          <p className="text-xs text-slate-300 leading-relaxed">{req.adminNotes}</p>
                        ) : (
                          <p className="text-xs text-slate-500 leading-relaxed italic">لا توجد ملاحظات تقنية مدونة حتى الآن، بانتظار تشخيص الفني المسؤول في الورشة.</p>
                        )}
                        
                        <div className="pt-2 flex justify-between items-center bg-slate-950 border-t border-slate-900 mt-2">
                          <span className="text-xs text-slate-400 font-bold">التكلفة النهائية للصيانة:</span>
                          <span className="font-mono text-base md:text-lg font-black text-emerald-400">
                            {req.cost ? `$${req.cost.toLocaleString()}` : 'بانتظار الفحص'}
                          </span>
                        </div>
                      </div>

                      {/* CALL SUPPORT ACTION */}
                      <div className="text-center pt-2">
                        <p className="text-[11px] text-slate-500 mb-2">أريد التواصل مع الورشة هاتفياً للاستفسار السريع؟</p>
                        <a
                          href={`tel:${req.customerPhone}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-200 transition"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                          <span>اتصل بمدير الصيانة مباشرة</span>
                        </a>
                      </div>
                    </div>

                    {/* LIVE VERTICAL VISUAL TIMELINE */}
                    <div className="md:col-span-7 space-y-4">
                      <h4 className="text-sm font-bold text-slate-200 mb-4">مسار فحص وجاهزية الجهاز:</h4>
                      
                      <div className="relative border-r border-slate-800 mr-2 md:mr-4 pr-6 space-y-6">
                        {statusSteps.map((step, idx) => {
                          const isDone = idx < currentStatusIndex || req.status === 'collected';
                          const isCurrent = idx === currentStatusIndex && req.status !== 'collected';
                          const isUpcoming = idx > currentStatusIndex && req.status !== 'collected';

                          return (
                            <div key={step.key} className="relative text-right">
                              {/* Glowing Dot overlay */}
                              <span className={`absolute -right-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                                isDone 
                                  ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20' 
                                  : isCurrent 
                                  ? 'bg-cyan-500 border-cyan-500 animate-ping'
                                  : 'bg-slate-950 border-slate-800'
                              }`} />
                              
                              {/* Actual display dot representing status */}
                              {isCurrent && (
                                <span className="absolute -right-[29px] top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-cyan-500 border-cyan-500" />
                              )}

                              <div className="space-y-1 pr-1">
                                <h5 className={`text-xs md:text-sm font-bold transition duration-300 ${
                                  isDone ? 'text-emerald-400' : isCurrent ? 'text-cyan-400 text-[14px]' : 'text-slate-500'
                                }`}>
                                  {step.title}
                                </h5>
                                <p className={`text-[10px] md:text-xs leading-relaxed transition duration-300 ${
                                  isDone ? 'text-slate-300' : isCurrent ? 'text-slate-200' : 'text-slate-500'
                                }`}>
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-slate-950/20 border border-slate-900 rounded-3xl">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-300">لم نعثر على أي طلب موافق!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                يرجى التأكد من كتابة كود طلب الصيانة بشكل صحيح (مثال: r1 أو r2) أو كتابة نفس رقم الهاتف المستخدم في النموذج بالأرقام كاملة.
              </p>
            </div>
          )}
        </div>
      )}

      {/* FREQUENTLY ASKED ONSITE FAQ */}
      <div className="mt-12 pt-8 border-t border-slate-900 text-right space-y-4">
        <h3 className="text-sm font-black text-slate-400 flex items-center gap-1.5 justify-start">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          معلومات تهمك حول فترة وضوابط الصيانة:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 leading-relaxed">
          <p>
            • يتم تحديد التكلفة النهائية وإبلاغ العميل بها هاتفياً أو عبر إشعار تتبع الحالة قبل الشروع في فك لوحات الجهاز، للتأكد من موافقتك التامة على التكاليف المقدرة.
          </p>
          <p>
            • نعتمد على استيراد قطع غيار فئة الكفاءة الكاملة (Original OEM) ولا نركب كابلات تجارية رديئة للحفاظ على الشاشات والمستشعرات والميكروفونات الحيوية.
          </p>
        </div>
      </div>
    </section>
  );
};
