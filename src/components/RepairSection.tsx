import React, { useState, useRef } from 'react';
import { RepairRequest, DeviceCategory, CATEGORY_LABELS } from '../types';
import { Wrench, User, Phone, Laptop, AlertCircle, Upload, X, Check, BrainCircuit, Activity, Clock, DollarSign } from 'lucide-react';

interface RepairSectionProps {
  onSubmitRequest: (request: Omit<RepairRequest, 'id' | 'createdAt' | 'status'> & { images: string[] }) => void;
  recentRequestCreated: string | null; // ID of newly created request to prompt user
  setActiveTab: (tab: string) => void;
}

export const RepairSection: React.FC<RepairSectionProps> = ({ 
  onSubmitRequest, 
  recentRequestCreated,
  setActiveTab
}) => {
  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [category, setCategory] = useState<DeviceCategory>('phone');
  const [description, setDescription] = useState('');
  
  // Image attachments state
  const [imageFiles, setImageFiles] = useState<{ name: string; size: string; dataUrl: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // AI Diagnostics state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiDiagnosesResult, setAiDiagnosesResult] = useState<{
    fault: string;
    action: string;
    costRange: string;
    duration: string;
    difficulty: 'منخفضة' | 'متوسطة' | 'مرتفعة' | 'معقدة';
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read files and convert to Base64 DataURL
  const processFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار صور فقط لرفعها كملحق للجهاز.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const fileSizeKB = (file.size / 1024).toFixed(1);
          setImageFiles(prev => [
            ...prev,
            {
              name: file.name,
              size: `${fileSizeKB} KB`,
              dataUrl: e.target!.result as string
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Local AI rules engine for defect classification (Estimator)
  const handleAiDiagnostics = () => {
    if (!description.trim()) {
      alert('الرجاء كتابة وصف العطل أولاً ليقوم الذكاء الاصطناعي بتحليله وفحصه!');
      return;
    }

    setAiGenerating(true);
    setAiDiagnosesResult(null);

    // Simulate analysis delay
    setTimeout(() => {
      const descText = description.toLowerCase();
      let result: {
        fault: string;
        action: string;
        costRange: string;
        duration: string;
        difficulty: 'منخفضة' | 'متوسطة' | 'مرتفعة' | 'معقدة';
      } = {
        fault: 'عطل عام في اللوحة الإلكترونية أو نظام التشغيل',
        action: 'فحص مجهري للدوائر ومكونات الطاقة مع قياس الفولتية بدقة لتحديد القطعة المسببة للاختناق.',
        costRange: '35 - 75 دولار',
        duration: '1 - 2 يوم',
        difficulty: 'متوسطة'
      };

      if (descText.includes('شاشة') || descText.includes('كسر') || descText.includes('انكسار') || descText.includes('شاشه')) {
        result = {
          fault: 'تلف كلي أو جزئي في لوحة الشاشة الخارجية (Screen Assembly / LCD)',
          action: 'استبدال الشاشة بأخرى أصلية (OLED/Retina) وربط المستشعرات ونظام ترو-تون لضمان الأمان ومقاومة البصمات.',
          costRange: category === 'laptop' ? '120 - 250 دولار' : '60 - 150 دولار',
          duration: '3 - 6 ساعات',
          difficulty: 'متوسطة' as const
        };
      } else if (descText.includes('بطارية') || descText.includes('شحن') || descText.includes('بطاريه') || descText.includes('يسخن') || descText.includes('سخونة')) {
        result = {
          fault: 'تدهور خلايا البطارية وتلف دائرة الطاقة المسؤولة عن الشحن (IC Power)',
          action: 'تغيير خلايا البطارية بقطعة جديدة مكفولة بنسبة صحة 100% مع تنظيف الرواسب الحرارية المسببة للسخونة.',
          costRange: '25 - 65 دولار',
          duration: '1 - 2 ساعة',
          difficulty: 'منخفضة' as const
        };
      } else if (descText.includes('ماء') || descText.includes('مياه') || descText.includes('سقط') || descText.includes('غرق') || descText.includes('عصير')) {
        result = {
          fault: 'أكسدة كيميائية في موصلات اللوحة الأم (Water Damage Core Corrosion)',
          action: 'تفكيك كلي، تنظيف كيميائي وبالموجات فوق الصوتية لإزالة الأملاح، وتصليح المسارات المحروقة عبر المايكروسكوب الخاص.',
          costRange: '50 - 180 دولار',
          duration: '2 - 4 أيام',
          difficulty: 'معقدة' as const
        };
      } else if (descText.includes('كيبورد') || descText.includes('ازرار') || descText.includes('لوحة المفاتيح') || descText.includes('ماوس')) {
        result = {
          fault: 'تلف الغشاء الكربوني أو الميكانيكي للأزرار نتيجة الاستهلاك أو تسريب سائل',
          action: 'استبدال لوحة المفاتيح بالكامل أو الأزرار المتضررة وتنظيف الحساسات الدقيقة للملمس تحت الأزرار.',
          costRange: '30 - 85 دولار',
          duration: '1 يوم',
          difficulty: 'متوسطة' as const
        };
      } else if (descText.includes('صوت') || descText.includes('سماعه') || descText.includes('سماعة') || descText.includes('ميكروفون') || descText.includes('مايك')) {
        result = {
          fault: 'انسداد مجرى الصوت بالأتربة أو احتراق وشيعة المكبر الداخلي للاهتزاز',
          action: 'تنظيف مغناطيسي دقيق بضغط الهواء المركّز أو استبدال الكبسولة الصوتية للمكبر ومجموعة العزل والتوجيه.',
          costRange: '15 - 40 دولار',
          duration: '45 دقيقة',
          difficulty: 'منخفضة' as const
        };
      }

      setAiDiagnosesResult(result);
      setAiGenerating(false);
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deviceModel || !description) {
      alert('يرجى ملء جميع الحقول المطلوبة لتقديم طلب الصيانة بنجاح.');
      return;
    }

    const base64ImagesList = imageFiles.map(img => img.dataUrl);

    onSubmitRequest({
      customerName,
      customerPhone,
      deviceModel,
      category,
      description,
      images: base64ImagesList
    });

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
    setDescription('');
    setImageFiles([]);
    setAiDiagnosesResult(null);
  };

  return (
    <section id="repair-section" className="max-w-4xl mx-auto px-4 md:px-8 py-12">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          ورشة الصيانة الرقمية المتكاملة
        </h2>
        <p className="text-slate-400 text-sm">
          أدخل بيانات جهازك التالف، وقم بتقديم طلب صيانة للمختبر الخاص بنا. يمكنك رفع صور حقيقية للمشكلة والتمتع بـ فحص الذكاء الاصطناعي المقدر للأعطال والأسعار فورياً.
        </p>
      </div>

      {/* POPUP ALERT FOR NEW CREATED REQUEST */}
      {recentRequestCreated && (
        <div className="mb-8 p-6 rounded-2xl bg-slate-900 border-2 border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl animate-fade-in text-right">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Check className="w-5 h-5" />
              تم إرسال طلب الصيانة وتسجيله بنجاح!
            </h3>
            <p className="text-xs text-slate-300">
              قم بحفظ "رقم جوالك" أو "رمز الطلب" التالي لتتبع حالة جهازك عبر التبويب المخصص:
            </p>
            <div className="font-mono text-cyan-400 font-extrabold text-lg select-all bg-slate-950 px-4 py-1.5 rounded-lg border border-slate-800 inline-block">
              {recentRequestCreated}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('track')}
            className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition cursor-pointer"
          >
            الانتقال لتتبع حالة الجهاز
          </button>
        </div>
      )}

      {/* TWO COLUMN INTAKE & SYSTEM ANALYSIS FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
        {/* INTAKE FORM */}
        <form onSubmit={handleFormSubmit} className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
          <div className="border-b border-slate-800 pb-4 mb-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">نموذج فحص واستلام الأجهزة</h3>
              <p className="text-[11px] text-slate-500">تقديم بيانات حقيقية لتسهيل تشخيص المهندسين</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer Name */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                الاسم الكامل <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="أدخل اسمك الثلاثي"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm transition"
              />
            </div>

            {/* Customer Phone */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                رقم جوال للتواصل ومتابعة الحالة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: +213 555 123 456"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm font-mono text-left transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Device Model */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                طراز ونوع الجهاز بدقة <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: MacBook Pro M2, iPhone 14 Pro"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm transition"
              />
            </div>

            {/* Category dropdown */}
            <div className="space-y-1 text-right">
              <label className="text-xs font-bold text-slate-300 mb-1 block">تصنيف ونوع الجهاز الرئيسي</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DeviceCategory)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm transition"
              >
                {(Object.keys(CATEGORY_LABELS) as DeviceCategory[]).map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Issue description */}
          <div className="space-y-1 text-right">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                وصف الأعطاب والمظاهر بالتفصيل <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAiDiagnostics}
                disabled={aiGenerating || !description.trim()}
                className="text-xs flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <BrainCircuit className="w-3.5 h-3.5 animate-bounce" />
                استخراج فحص تقديري ذكي
              </button>
            </div>
            <textarea
              required
              rows={4}
              placeholder="اكتب كيف حدث العطل وهل تعرضت لضربة، سوائل أو خلل شحن مفاجئ ليتسنى تقدير العيب وإعداد قطع الغيار..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm transition leading-relaxed resize-none"
            />
          </div>

          {/* DYNAMIC AI EVALUATOR RESPONSE INSIDE THE FORM */}
          {aiGenerating && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/20 text-center space-y-2">
              <Activity className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono animate-pulse">
                [AI_PROCESS] جاري مطابقة الأعطال، فحص كلمات وصف العيب، والبحث بقواعد الأسعار المعتمدة...
              </p>
            </div>
          )}

          {aiDiagnosesResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-l from-slate-950 via-slate-950 to-cyan-950/20 border border-cyan-500/20 space-y-3 text-right">
              <h4 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2">
                <BrainCircuit className="w-4.5 h-4.5" />
                فحص تقديري ذكي (مستنتج من الوصف)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1.5">
                <div className="space-y-1">
                  <span className="text-slate-500">العيب المشخّص:</span>
                  <p className="font-bold text-slate-200">{aiDiagnosesResult.fault}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">الإصلاح الضروري المتوقع:</span>
                  <p className="font-bold text-slate-200">{aiDiagnosesResult.action}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">السعر التقديري المتوقع</span>
                    <strong className="font-mono text-slate-200">{aiDiagnosesResult.costRange}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-slate-500 text-[10px] block">مدة العمل المتوقعة</span>
                    <strong className="font-mono text-slate-200">{aiDiagnosesResult.duration}</strong>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900 bg-slate-950/20">
                * ملاحظة: هذا التشخيص مبني على معطيات آلية أولية لمطابقة المشاكل الشائعة، الفحص الفيزيائي الفعلي بالورشة هو المعتمد النهائي.
              </div>
            </div>
          )}

          {/* DRAG-AND-DROP FILE UPLOAD ZONE */}
          <div className="space-y-2 text-right">
            <label className="text-xs font-bold text-slate-300">صور مرفقة للجهاز أو العطل الملاحظ (لتسريع الفحص)</label>
            
            <div
              id="file-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed ${
                isDragging ? 'border-cyan-400 bg-cyan-950/10' : 'border-slate-800 bg-slate-950/50 hover:bg-slate-950/80 hover:border-slate-700'
              } p-6 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" />
              <p className="text-xs md:text-sm text-slate-300 font-semibold">اسحب وأفلت صور الجهاز هنا أو انقر للتصفح اليدوي</p>
              <p className="text-[10px] text-slate-500">يدعم صيغ الصور الشائعة (PNG, JPG, WEBP) كحد أقصى للرفع</p>
            </div>

            {/* ATTACHMENT LIST */}
            {imageFiles.length > 0 && (
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-3.5 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                  <span className="text-xs font-bold text-slate-400">الملفات المرفقة ({imageFiles.length})</span>
                  <button
                    type="button"
                    onClick={() => setImageFiles([])}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    تفأج وحذف الكل
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex flex-col justify-between overflow-hidden">
                      <div className="aspect-square bg-slate-950 rounded-md overflow-hidden relative">
                        <img
                          src={file.dataUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-1 text-right mt-1.5">
                        <p className="text-[9px] text-slate-300 truncate font-mono">{file.name}</p>
                        <p className="text-[8px] text-slate-600 font-mono">{file.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 left-2 p-1 bg-rose-950Hover:bg-rose-900 text-rose-300 hover:text-white rounded-full border border-rose-800"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800/60 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setCustomerName('');
                setCustomerPhone('');
                setDeviceModel('');
                setDescription('');
                setImageFiles([]);
                setAiDiagnosesResult(null);
              }}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition cursor-pointer"
            >
              مسح البيانات وإلغاء
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-sm rounded-xl hover:opacity-95 shadow-lg shadow-emerald-500/10 cursor-pointer transition.transform hover:-translate-y-0.5 active:translate-y-0"
            >
              تسجيل الطلب وتسليم الجهاز
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
