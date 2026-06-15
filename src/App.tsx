import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { RepairSection } from './components/RepairSection';
import { TrackRepair } from './components/TrackRepair';
import { DashboardAdmin } from './components/DashboardAdmin';
import { Footer } from './components/Footer';
import { Product, RepairRequest, DeviceCategory, RepairStatus, CATEGORY_LABELS } from './types';
import { INITIAL_PRODUCTS, INITIAL_REPAIR_REQUESTS } from './data/mockData';
import { Smartphone, Laptop, Wrench, Shield, CheckCircle2, Sparkles, AlertCircle, RefreshCw, Palette, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

export const App: React.FC = () => {
  // Tabs State: 'home' | 'store' | 'repair' | 'track' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('home');

  // Background Theme State: 'cyber-teal' | 'navy-orange'
  const [bgTheme, setBgTheme] = useState<'cyber-teal' | 'navy-orange'>(() => {
    return (localStorage.getItem('electro_bg_theme') as 'cyber-teal' | 'navy-orange') || 'cyber-teal';
  });

  const toggleBgTheme = () => {
    const next = bgTheme === 'cyber-teal' ? 'navy-orange' : 'cyber-teal';
    setBgTheme(next);
    localStorage.setItem('electro_bg_theme', next);
  };

  // Persistence State
  const [products, setProducts] = useState<Product[]>([]);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [recentRequestCreated, setRecentRequestCreated] = useState<string | null>(null);

  // Initialize data from LocalStorage
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const firebaseProducts = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Product[];
  
        setProducts(firebaseProducts);
      }
    );
  
    const savedRepairs = localStorage.getItem('electro_repairs');
    const savedAdminAuth = localStorage.getItem('electro_admin_auth');
  
    if (savedRepairs) {
      setRepairRequests(JSON.parse(savedRepairs));
    } else {
      setRepairRequests(INITIAL_REPAIR_REQUESTS);
      localStorage.setItem(
        'electro_repairs',
        JSON.stringify(INITIAL_REPAIR_REQUESTS)
      );
    }
  
    if (savedAdminAuth === 'true') {
      setIsAdminLoggedIn(true);
    }
  
    return () => unsubscribe();
  }, []);

  // Sync utilities
  const saveProductsToDb = (newProds: Product[]) => {
    setProducts(newProds);
    localStorage.setItem('electro_products', JSON.stringify(newProds));
  };

  const saveRepairsToDb = (newRepairs: RepairRequest[]) => {
    setRepairRequests(newRepairs);
    localStorage.setItem('electro_repairs', JSON.stringify(newRepairs));
  };

  // Admin Login Logout Handlers
  const handleLoginAdmin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('electro_admin_auth', 'true');
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.setItem('electro_admin_auth', 'false');
  };

  // Product Add / Delete Handlers
  const handleAddProduct = async (prod: Omit<Product, 'id'>) => {
    await addDoc(collection(db, 'products'), {
      ...prod,
    });
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const handleUpdateProductStock = async (
    id: string,
    inStock: boolean
  ) => {
    await updateDoc(doc(db, 'products', id), {
      stock: inStock,
    });
  };

  // Customer submit Repair request
  const handleAddNewRepairRequest = (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status'> & { images: string[] }) => {
    const newId = `r-${Math.floor(1000 + Math.random() * 9000)}`; // unique easy track request code (e.g. r-5839)
    const newRequest: RepairRequest = {
      ...req,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newRequest, ...repairRequests];
    saveRepairsToDb(updated);
    setRecentRequestCreated(newId);

    // auto dismiss banner after 2 minutes
    setTimeout(() => {
      setRecentRequestCreated(null);
    }, 120000);
  };

  // Admin updates repair state
  const handleUpdateRepairRequest = (id: string, status: RepairStatus, cost: number, adminNotes: string) => {
    const updated = repairRequests.map(req => 
      req.id === id ? { ...req, status, cost, adminNotes } : req
    );
    saveRepairsToDb(updated);
  };

  // Reset demo databases tool (Admin option helper)
  const handleResetDatabases = () => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط المتجر والورشة بقيم التهيئة الافتراضية؟')) {
      localStorage.removeItem('electro_products');
      localStorage.removeItem('electro_repairs');
      setProducts(INITIAL_PRODUCTS);
      setRepairRequests(INITIAL_REPAIR_REQUESTS);
      localStorage.setItem('electro_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('electro_repairs', JSON.stringify(INITIAL_REPAIR_REQUESTS));
      alert('تم إعادة تهيئة قاعدة المعطيات بنجاح!');
    }
  };

  return (
    <div className={`min-h-screen ${bgTheme === 'navy-orange' ? 'bg-[#0B1B2D]' : 'bg-slate-950'} text-slate-100 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden transition-colors duration-500`}>
      
      {/* WhatsApp Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/213555123456?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%85%D8%A7%D9%8B%20%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%20KB%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%B5%D9%8A%D8%A7%D9%86%D8%A9%20%D8%AC%D9%87%D8%A7%D8%B2%D9%82%D9%8A"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 hover:text-slate-950 font-black rounded-full shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 border border-emerald-400 duration-300 group cursor-pointer"
          style={{ direction: 'rtl' }}
          title="تواصل معنا فوراً عبر واتساب"
        >
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-900 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-950"></span>
          </div>
          <MessageCircle className="w-5 h-5 text-slate-950 group-hover:rotate-6 transition-transform" />
          <span className="text-xs font-black">الدعم والصيانة عبر واتساب</span>
        </a>
      </div>

      {/* Background Theme Switcher Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleBgTheme}
          className="flex items-center gap-2.5 px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 hover:text-white border border-emerald-500/35 hover:border-emerald-400/60 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 group cursor-pointer"
          style={{ direction: 'rtl' }}
          title="تغيير مظهر الخلفية"
        >
          <Palette className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xs font-bold font-sans">تبديل مظهر الخلفية</span>
          <span className="text-[10px] bg-emerald-950/70 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/10 font-mono">
            {bgTheme === 'cyber-teal' ? 'سيبراني أخضر' : 'كحلي برتقالي'}
          </span>
        </button>
      </div>

      {/* Dynamic Backgrounds and Glow Orbs */}
      {bgTheme === 'cyber-teal' ? (
        <>
          {/* Immersive Dark Teal/Emerald Cyber Ambient Glows (from bg.png) */}
          <div className="ambient-glow-top" />
          <div className="ambient-glow-center" />
          <div className="ambient-glow-bottom" />
        </>
      ) : (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Glowing Teal Orb (Top Left) */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00A88F] rounded-full blur-[128px] opacity-20" />
          
          {/* Glowing Orange Orb (Bottom Right) */}
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#F26522] rounded-full blur-[128px] opacity-15" />
        </div>
      )}

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdminLoggedIn={isAdminLoggedIn}
        onLogoutAdmin={handleLogoutAdmin}
      />

      <main className="flex-grow z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-16"
            >
              {/* Giant Pitch Hero */}
              <HeroSection setActiveTab={setActiveTab} />

              {/* THREE REPAIR CARDS SHORTCUT BANNER */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-slate-900 rounded-3xl p-6 text-right flex flex-col justify-between">
                    <div>
                      <Smartphone className="w-8 h-8 text-cyan-400 mb-4" />
                      <h3 className="font-extrabold text-white text-base mb-2">صيانة الهواتف المتقدمة</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        نمتلك طاولات ولحام مايكروسكوب لتبديل المكونات الدقيقة، تصليح اللوحة الأم، تبديل شاشات OLED أصلية دون إفساد الحساسات أو الواجهات الأمامية.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('repair')} className="text-xs font-bold text-cyan-400 hover:underline mt-4 flex items-center justify-start gap-1">
                      طلب صيانة فورية <span>←</span>
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-slate-900 rounded-3xl p-6 text-right flex flex-col justify-between">
                    <div>
                      <Laptop className="w-8 h-8 text-indigo-400 mb-4" />
                      <h3 className="font-extrabold text-white text-base mb-2">صيانة أجهزة الماك والحاسوب</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        استعادة نظام التبريد الحراري، استبدال الشاشات المتصدعة، حل مشكلة البطاريات المنتفخة، وتصفيح اللوحة الكهربائية من أضرار تسريب السوائل.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('repair')} className="text-xs font-bold text-indigo-400 hover:underline mt-4 flex items-center justify-start gap-1">
                      حجز موعد الورشة <span>←</span>
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-950 to-slate-950 border border-slate-900 rounded-3xl p-6 text-right flex flex-col justify-between">
                    <div>
                      <Wrench className="w-8 h-8 text-emerald-400 mb-4" />
                      <h3 className="font-extrabold text-white text-base mb-2">تتبع حقيقي على مدار الساعة</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        لا ندعك تتساءل عن التقدم! فور تسليم جهازك للورشة، يمكنك تتبع الملاحظات الفنية المكتوبة والتسعيرات خطوة بخطوة عبر كودك الذكي على الموقع.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab('track')} className="text-xs font-bold text-emerald-400 hover:underline mt-4 flex items-center justify-start gap-1">
                      جرب التتبع وحالة جهازك <span>←</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FEATURED EXCELLENCY SHOWCASE ITEMS */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-900 pb-4">
                  <div className="text-right">
                    <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                      أبرز العروض الحالية بالمعرض
                    </h3>
                    <p className="text-xs text-slate-400">تشكيلة مختارة من أفضل أجهزتنا التي نجهّزها للبيع بضمان كامل وفحص جودة فني مسبق</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('store')} 
                    className="text-xs font-bold text-cyan-400 hover:underline"
                  >
                    تصفح كافة الأجهزة بالمعرض
                  </button>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.slice(0, 3).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setActiveTab('store')}
                        className="group bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-3xl overflow-hidden p-4 space-y-4 cursor-pointer transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-900">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 text-[9px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-400 rounded">
                            {CATEGORY_LABELS[prod.category]}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-right">
                          <h4 className="font-extrabold text-slate-100 text-sm group-hover:text-cyan-400 transition">{prod.name}</h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{prod.description}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
                          <span className="font-mono text-cyan-400 text-sm font-bold">${prod.price}</span>
                          <span className="text-[10px] text-slate-500">تفاصيل الشراء والطلب</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-950/20 rounded-2xl text-slate-500 text-xs">لا توجد منتجات معروضة حالياً.</div>
                )}
              </div>

              {/* DEMO TOOL: Reset databases to default (placed at bottom unobtrusively) */}
              <div className="max-w-md mx-auto py-8 text-center px-4 self-center">
                <button
                  type="button"
                  onClick={handleResetDatabases}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/20 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-xs text-slate-600 hover:text-slate-300 transition duration-150 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>إعادة ضبط البيانات المعروضة افتراضياً</span>
                </button>
              </div>

            </motion.div>
          )}

          {activeTab === 'store' && (
            <motion.div
              key="store-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCatalog products={products} />
            </motion.div>
          )}

          {activeTab === 'repair' && (
            <motion.div
              key="repair-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <RepairSection 
                onSubmitRequest={handleAddNewRepairRequest} 
                recentRequestCreated={recentRequestCreated} 
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'track' && (
            <motion.div
              key="track-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <TrackRepair repairRequests={repairRequests} />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardAdmin 
                products={products}
                repairRequests={repairRequests}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProductStock={handleUpdateProductStock}
                onUpdateRepairRequest={handleUpdateRepairRequest}
                isAdminLoggedIn={isAdminLoggedIn}
                onLoginAdmin={handleLoginAdmin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};
