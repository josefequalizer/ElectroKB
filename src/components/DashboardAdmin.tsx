import React, { useState, useRef } from 'react';
import { Product, RepairRequest, DeviceCategory, RepairStatus, REPAIR_STATUS_LABELS, CATEGORY_LABELS } from '../types';
import { Plus, Trash, Check, Power, Lock, KeyRound, Wrench, ShieldAlert, Cpu, Laptop, Phone, PlusCircle, PenTool, ClipboardList, CheckCircle, Upload, X } from 'lucide-react';

interface DashboardAdminProps {
  products: Product[];
  repairRequests: RepairRequest[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProductStock: (id: string, inStock: boolean) => void;
  onUpdateRepairRequest: (id: string, status: RepairStatus, cost: number, adminNotes: string) => void;
  isAdminLoggedIn: boolean;
  onLoginAdmin: () => void;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({
  products,
  repairRequests,
  onAddProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onUpdateRepairRequest,
  isAdminLoggedIn,
  onLoginAdmin
}) => {
  // Login State
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin tab
  const [adminTab, setAdminTab] = useState<'repairs' | 'products' | 'add-product'>('repairs');

  // Add Product form fields
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<DeviceCategory>('phone');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newSpecs, setNewSpecs] = useState('');
  const [newStock, setNewStock] = useState(true);

  // Ref and state for file upload from device
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processLocalFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة مناسب لرفعه للجهاز.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setNewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Editing state for Repairs
  const [editingRepairId, setEditingRepairId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<RepairStatus>('pending');
  const [editCost, setEditCost] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Preset typical Unsplash electronic photos to help admin easily pick
  const imagePresets = [
    { label: 'هاتف ذكي أنيق', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
    { label: 'هاتف أسود متطور', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600' },
    { label: 'ماك بوك فضي', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600' },
    { label: 'لابتوب ألعاب حديث', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600' },
    { label: 'سماعات حديثة', url: 'https://images.unsplash.com/photo-1588449668338-d13417f16bf4?auto=format&fit=crop&q=80&w=600' },
    { label: 'شاحن مغناطيسي', url: 'https://images.unsplash.com/photo-1622445262465-24819af5222e?auto=format&fit=crop&q=80&w=600' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234') {
      onLoginAdmin();
      setLoginError('');
    } else {
      setLoginError('الرمز السري غير صحيح! يرجى إدخال الرقم الافتراضي لتسجيل الدخول: 1234');
    }
  };

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newDesc) {
      alert('الرجاء تعبئة البيانات الأساسية للمنتج الجديد.');
      return;
    }

    const specificationsList = newSpecs
      ? newSpecs.split(',').map(s => s.trim()).filter(Boolean)
      : ['مواصفات قياسية أصلية', 'ضمان من فرعنا الإلكتروني'];

    const chosenImage = newImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600';

    onAddProduct({
      name: newName,
      category: newCat,
      price: Number(newPrice),
      description: newDesc,
      image: chosenImage,
      specs: specificationsList,
      stock: newStock
    });

    // Reset Form fields
    setNewName('');
    setNewPrice('');
    setNewDesc('');
    setNewImage('');
    setNewSpecs('');
    setNewStock(true);
    setAdminTab('products');
    alert('تم تسجيل المنتج الجديد في كتالوج المعرض ومزامنته فورياً!');
  };

  // Turn on edit mode for repair
  const initEditRepair = (repair: RepairRequest) => {
    setEditingRepairId(repair.id);
    setEditStatus(repair.status);
    setEditCost(repair.cost ? String(repair.cost) : '');
    setEditNotes(repair.adminNotes || '');
  };

  const handleSaveRepairUpdate = (id: string) => {
    onUpdateRepairRequest(id, editStatus, Number(editCost) || 0, editNotes);
    setEditingRepairId(null);
    alert('تم تحديث بيانات ومسار صيانة الجهاز ومزامنة الإشعار حياً!');
  };

  // IF NOT AUTHENTICATED
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-view" className="max-w-md mx-auto px-4 py-16 text-right">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">تسجيل دخول فني الإدارة كمسؤول</h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              أهلاً بك يا أدمن، تتيح لك لوحة الإدارة التحكم بجرد الكتالوج وتحديث مسار إصلاح أجهزة عملائك وتدوين الملاحظات.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">الرقم السري للوصول الافتراضي (1234) <span className="text-rose-500">*</span></label>
              <input
                id="admin-password-input"
                type="password"
                required
                placeholder="أدخل الرمز السري للإدارة..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 text-slate-100 border border-slate-800 focus:border-purple-500 rounded-xl outline-none text-sm font-mono text-center transition"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-lg border border-rose-900/60 leading-relaxed text-right">
                {loginError}
              </p>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer transition shadow-lg shadow-purple-500/10"
            >
              تسجيل الدخول الآمن
            </button>
          </form>
        </div>
      </div>
    );
  }

  // IF LOGGED IN
  return (
    <section id="admin-dashboard" className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      
      {/* HEADER WITH CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">لوحة المسؤول نشطة</span>
          </div>
          <h2 className="text-2xl font-black text-white">بوابة ورشة صيانة الأجهزة وإدارة المعرض</h2>
          <p className="text-xs text-slate-500">مرحباً بك يا مسؤول، تحكم كامل بالمنتجات والصيانة حياً.</p>
        </div>

        {/* ADMIN TAB CONTROLLERS */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setAdminTab('repairs')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'repairs'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            إدارة طلبات الصيانة بالورشة ({repairRequests.length})
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'products'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-white'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            جرد أجهزة المعرض المتوفرة ({products.length})
          </button>

          <button
            onClick={() => setAdminTab('add-product')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              adminTab === 'add-product'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 font-extrabold" />
            إضافة جهاز جديد للكتالوج
          </button>
        </div>
      </div>

      {/* VIEW PANEL ROUTER (ADMIN) */}

      {/* 1. MANAGE REPAIR WORKSHOP */}
      {adminTab === 'repairs' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white text-right">طلبات أجهزة الصيانة المسجلة في الورشة</h3>
          
          {repairRequests.length === 0 ? (
            <div className="text-center py-12 border border-slate-900 rounded-3xl bg-slate-950/20">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-xs text-slate-400">لا توجد أجهزة مدرجة على مكتب الصيانة حالياً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 text-right">
              {repairRequests.map((req) => {
                const isEditing = editingRepairId === req.id;
                return (
                  <div key={req.id} className="bg-slate-950 border border-slate-900 rounded-2xl p-6 hover:border-slate-800 transition">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4 mb-4">
                      
                      {/* Name & device info */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-extrabold text-white text-sm md:text-base">{req.deviceModel}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono">ID: {req.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-400 font-mono">
                            {CATEGORY_LABELS[req.category as DeviceCategory] || req.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          بواسطة العميل: <strong className="text-slate-200">{req.customerName}</strong> | جوال: <strong className="text-slate-200 select-all">{req.customerPhone}</strong>
                        </p>
                      </div>

                      {/* Display Status Indicator */}
                      {!isEditing && (
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-full ${REPAIR_STATUS_LABELS[req.status].color}`}>
                            {REPAIR_STATUS_LABELS[req.status].label}
                          </span>
                          <button
                            onClick={() => initEditRepair(req)}
                            className="px-3 py-1 bg-purple-950 text-purple-300 hover:bg-purple-900 hover:text-white border border-purple-800 text-[10px] rounded cursor-pointer transition"
                          >
                            حديث وتصليح
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Defect description & attachments */}
                    <div className="space-y-4">
                      <div className="text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-900">
                        <strong className="text-slate-400 block mb-1">وصف العيب المقدم:</strong>
                        <span className="text-slate-300 italic">"{req.description}"</span>
                      </div>

                      {req.images && req.images.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 block">صور العطب المرفوعة:</span>
                          <div className="flex gap-2">
                            {req.images.map((img, i) => (
                              <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded border border-slate-800" />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* NON EDITING DISPLAY DETAILS */}
                      {!isEditing && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-slate-900/80 mt-4">
                          <div>
                            <span className="text-slate-500 block mb-0.5">تقرير صيانة المسؤول:</span>
                            <p className="text-slate-300 font-semibold">{req.adminNotes || 'لا توجد تعليقات فنية صيانة مدونة بك بعد.'}</p>
                          </div>
                          <div className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                            <span className="text-slate-500">التكلفة والقطع المقدرة:</span>
                            <strong className="font-mono text-emerald-400 text-sm">${req.cost?.toLocaleString() || 0}</strong>
                          </div>
                        </div>
                      )}

                      {/* EDIT COLS FORM ON THE SPOT */}
                      {isEditing && (
                        <div className="p-4 rounded-xl bg-slate-900 border border-purple-900/40 space-y-4 mt-4 animate-fade-in">
                          <h4 className="text-xs font-bold text-purple-400 block mb-2">إصدار التقرير الفني والتسعير:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Status select info */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block">مرآة مسار تصليح الجهاز:</label>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as RepairStatus)}
                                className="w-full px-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded outline-none text-xs"
                              >
                                {(Object.keys(REPAIR_STATUS_LABELS) as RepairStatus[]).map(statusKey => (
                                  <option key={statusKey} value={statusKey}>{REPAIR_STATUS_LABELS[statusKey].label}</option>
                                ))}
                              </select>
                            </div>

                            {/* Cost Input */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 block">تكلفة قطع الغيار مع اليد العاملة ($):</label>
                              <input
                                type="number"
                                placeholder="مثال: 120"
                                value={editCost}
                                onChange={(e) => setEditCost(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded outline-none text-xs font-mono"
                              />
                            </div>
                          </div>

                          {/* Notes description textarea */}
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 block">ملاحظات وتقرير المهندس (العيوب والقطع التي تم تبديلها):</label>
                            <textarea
                              rows={2}
                              placeholder="مثال: تم تفكيك شاشات الماك بوك القديمة المكسورة وتنظيف المسارات، ركبنا شاشة OEM جديدة مكفولة بنجاح مع مطابقة الألوان..."
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded outline-none text-xs leading-relaxed"
                            />
                          </div>

                          {/* Control Save close block */}
                          <div className="flex justify-end gap-2 text-right pt-2">
                            <button
                              onClick={() => setEditingRepairId(null)}
                              className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-[10px] rounded-lg cursor-pointer"
                            >
                              إلغاء التعديل
                            </button>
                            <button
                              onClick={() => handleSaveRepairUpdate(req.id)}
                              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              حفظ ومزامنة الحالة
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. MANAGE PRODUCT SHOWCASE STOCK */}
      {adminTab === 'products' && (
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white text-right">جرد المنتجات على رصيف العرض بالكتالوج</h3>
          
          <div className="bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800">
                    <th className="py-3 px-4 text-slate-400">اسم ومعطيات الجهاز</th>
                    <th className="py-3 px-4 text-slate-400">الفئة تصنيف</th>
                    <th className="py-3 px-4 text-slate-400">سعر البيع المقدر</th>
                    <th className="py-3 px-4 text-slate-400 text-center">مخزون المعرض</th>
                    <th className="py-3 px-4 text-center text-slate-400">خيارات حيوية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60 font-mono">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-900/20 transition">
                      <td className="py-3.5 px-4 font-sans text-right">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt="" className="h-10 w-14 object-cover rounded border border-slate-900" />
                          <div>
                            <span className="font-extrabold text-slate-100 block">{prod.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {prod.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-300">
                        {CATEGORY_LABELS[prod.category]}
                      </td>
                      <td className="py-3.5 px-4 text-cyan-400 font-bold">${prod.price}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onUpdateProductStock(prod.id, !prod.stock)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold cursor-pointer transition ${
                            prod.stock 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-905/30' 
                              : 'bg-rose-950/40 text-rose-400 border border-rose-905/30'
                          }`}
                        >
                          {prod.stock ? 'متاح للطلب والمبيع' : 'نفد من المخزون'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-center text-rose-400 font-sans font-bold">
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من رغبتك في حذف جهاز "${prod.name}" نهائياً من الرفوف؟`)) {
                              onDeleteProduct(prod.id);
                            }
                          }}
                          className="p-2 bg-rose-950/40 hover:bg-rose-900 rounded-lg text-rose-300 hover:text-white border border-rose-901/40 cursor-pointer transition"
                        >
                          <Trash className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEW PRODUCT ENTRY CREATOR */}
      {adminTab === 'add-product' && (
        <form onSubmit={handleCreateProductSubmit} className="bg-slate-900/60 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 text-right">
          <div className="border-b border-slate-800 pb-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950 text-emerald-400">
              <PlusCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">عرض وإدخال جهاز ومعدات جديدة بالمعرض</h3>
              <p className="text-[10px] text-slate-500">جرد وتوسيع الخيارات المتاحة لزوار موقعك الإلكتروني لشرائها</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* New name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم الهاتف أو المنتج <span className="text-rose-500">*</span></label>
              <input
                type="text"
                required
                placeholder="مثال: سامسونج جالكسي S24 ألترا 5G"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm font-sans"
              />
            </div>

            {/* New price */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block mb-1">سعر البيع النهائي بالرمز ($) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                required
                placeholder="مثال: 1299"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm font-mono text-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block mb-1">صنف الفئة الفرعية للجهاز</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as DeviceCategory)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm"
              >
                {(Object.keys(CATEGORY_LABELS) as DeviceCategory[]).map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>

            {/* New Specs list */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block mb-1">مواصفات مميزة (افصل بينها بفاصلة ",")</label>
              <input
                type="text"
                placeholder="مثال: شاشة 120Hz, بطاقة جرافيكس 8GB, معالج مائي"
                value={newSpecs}
                onChange={(e) => setNewSpecs(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm"
              />
            </div>
          </div>

          {/* New Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 block mb-1">شرح عام ومزايا وتفصيل الاستخدام للجهاز <span className="text-rose-500">*</span></label>
            <textarea
              required
              rows={3}
              placeholder="اكتب نبذة تسويقية جذابة تشمل المعالج، الكفالات، أو الإكسسوارات المرفقة مع هذا المنتج لزيادة المبيعات..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm leading-relaxed font-sans"
            />
          </div>

          {/* New Image Preset and Text input */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-emerald-400 border-r-2 border-emerald-500 pr-2">تحديد صورة معاينة المنتج</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A: Device Upload */}
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-slate-300 block">الخيار 1: رفع صورة مباشرة من جهازك</label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      processLocalFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition duration-150 flex flex-col justify-center items-center ${
                    isDragging 
                      ? 'border-emerald-500 bg-emerald-950/20' 
                      : newImage.startsWith('data:') 
                        ? 'border-emerald-500 bg-emerald-950/10' 
                        : 'border-slate-800 hover:border-emerald-500/35 bg-slate-950/40'
                  }`}
                  style={{ minHeight: '120px' }}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processLocalFile(e.target.files[0]);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {newImage && newImage.startsWith('data:') ? (
                    <div className="relative group p-1 border border-emerald-500/30 rounded-lg bg-slate-950">
                      <img src={newImage} alt="Local Preview" className="h-16 w-auto object-contain rounded" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewImage('');
                        }}
                        className="absolute -top-1.5 -left-1.5 p-1 bg-rose-950 text-rose-300 hover:bg-rose-900 hover:text-white rounded-full cursor-pointer border border-rose-800/40"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-emerald-400 mb-1 animate-bounce" />
                      <span className="text-[11px] font-bold text-slate-300">انقر هنا أو اسحب الصورة لرفعها</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">يدعم JPG, PNG مجاناً للمخزن</span>
                    </>
                  )}
                </div>
              </div>

              {/* Option B: External URL link */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 block mb-1">الخيار 2: استخدام رابط صورة خارجي</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImage.startsWith('data:') ? '' : newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 focus:border-cyan-500 rounded-xl outline-none text-sm font-mono text-left"
                  />
                  {newImage && !newImage.startsWith('data:') && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">رابط معتمد حالياً:</span>
                      <img src={newImage} alt="External Preview" className="h-8 w-12 object-cover rounded border border-slate-800" />
                    </div>
                  )}
                </div>

                {/* Visual pickers shortcuts */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-sans font-bold">الخيار 3: نقرة سريعة لاختيار صورة نموذجية جاهزة:</span>
                  <div className="flex flex-wrap gap-1.5 justify-start">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewImage(preset.url);
                          alert(`تم اختيار الصورة ذات الصلة: ${preset.label}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[9px] border font-bold transition flex items-center gap-1 cursor-pointer ${
                          newImage === preset.url
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                            : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                        }`}
                      >
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Stock default */}
          <div className="flex items-center justify-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850 w-fit">
            <span className="text-xs text-slate-300 font-bold block">متاح فوراً كسلعة نشطة بالمخازن؟</span>
            <input
              type="checkbox"
              checked={newStock}
              onChange={(e) => setNewStock(e.target.checked)}
              className="w-4 h-4 text-cyan-600 border-slate-800 bg-slate-950 rounded outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800/60 flex justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={() => {
                setNewName('');
                setNewPrice('');
                setNewDesc('');
                setNewImage('');
                setNewSpecs('');
              }}
              className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition cursor-pointer"
            >
              إعادة تهيئة
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-sm rounded-xl hover:opacity-95 shadow-lg shadow-emerald-500/10 cursor-pointer transition"
            >
              تسجيل وضخ المنتج بالمعرض
            </button>
          </div>
        </form>
      )}

    </section>
  );
};
