import React, { useState } from 'react';
import { Product, DeviceCategory, CATEGORY_LABELS } from '../types';
import { Search, SlidersHorizontal, Check, Info, ArrowLeftRight, Heart, X, MessageSquareCode } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filter logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.specs.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const toggleCompare = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('يمكنك مقارنة 3 أجهزة كحد أقصى في وقت واحد');
        return prev;
      }
      return [...prev, product];
    });
  };

  const handleInquiry = (product: Product) => {
    const message = `مرحباً، أود الاستفسار عن توفر وجاهزية الجهاز التالي للشراء:\n- اسم كود الجهاز: ${product.name}\n- السعر المذكور: ${product.price} دولار\n- الرابط: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/213555123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="product-catalog" className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          معرض الأجهزة ومستلزمات التقنية
        </h2>
        <p className="text-slate-400 text-sm md:text-base">
          تصفح تشكيلة من الهواتف الذكية الحديثة، الحواسيب القوية، وأحدث الإكسسوارات والملقحات المصاحبة لها المتوفرة لدينا بضمان كامل وفحص جودة مسبق من مهندسي الصيانة لدينا.
        </p>
      </div>

      {/* FILTER & SEARCH BAR BLOCK */}
      <div className="glass-panel p-4 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-400" />
          <input
            id="store-search-input"
            type="text"
            placeholder="ابحث عن هاتف، لابتوب، مواصفات أو إكسسوار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 bg-slate-950/80 text-slate-100 border border-emerald-500/20 focus:border-emerald-500 rounded-xl outline-none text-sm transition"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 w-full md:w-auto overflow-x-auto justify-start md:justify-end pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25 font-black'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-emerald-500/10'
            }`}
          >
            الكل ({products.length})
          </button>
          
          {(Object.keys(CATEGORY_LABELS) as DeviceCategory[]).map((cat) => {
            const count = products.filter(p => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25 font-black'
                    : 'bg-slate-950/80 text-slate-400 hover:text-white border border-emerald-500/10'
                }`}
              >
                {CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPARISON UTILITY NOTIFICATION BAR */}
      {compareList.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-200">
              تم اختيار <strong className="text-cyan-400 font-bold">{compareList.length}</strong> أجهزة للمقارنة والمطابقة.
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-bold rounded-lg cursor-pointer"
            >
              قارن المواصفات الآن
            </button>
            <button
              onClick={() => setCompareList([])}
              className="px-3 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 text-xs font-medium rounded-lg cursor-pointer"
            >
              إلغاء المقارنة
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-slate-900 rounded-2xl bg-slate-950/20">
          <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">لم نعثر على نتائج مألوفة!</h3>
          <p className="text-slate-500 text-sm mt-1">يرجى التحقق من صياغة مصطلحات البحث أو تغيير فئة الفلاتر.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const isComparing = compareList.some(p => p.id === product.id);
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group relative flex flex-col justify-between bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Product Image Box */}
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category overlay */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-1 text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-cyan-400 border border-slate-800 rounded">
                    {CATEGORY_LABELS[product.category]}
                  </span>

                  {/* Stock check overlay */}
                  {product.stock ? (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-900/60 rounded">
                      متوفر في المتجر
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold bg-rose-950/80 backdrop-blur-md text-rose-400 border border-rose-900/60 rounded">
                      غير متوفر حالياً
                    </span>
                  )}

                  {/* Top-left Quick-Action Controls */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className={`p-2 rounded-lg backdrop-blur-sm shadow-md transition ${
                        isFav ? 'bg-rose-500 text-white' : 'bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={(e) => toggleCompare(product, e)}
                      className={`p-2 rounded-lg backdrop-blur-sm shadow-md transition ${
                        isComparing ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info and price */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-100 text-sm md:text-base group-hover:text-cyan-400 transition leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-900/80 mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">سعر العرض</span>
                      <span className="font-mono font-extrabold text-sm md:text-base text-cyan-400">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs flex items-center gap-1.5 text-cyan-400 font-semibold group-hover:underline">
                      تفاصيل كاملة <Info className="w-3.5 h-3.5 font-bold" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED PRODUCT DIALOG MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-950/85 hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
              {/* Product Info Splitted Image + Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="aspect-4/3 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4 text-right">
                  <span className="inline-block px-2.5 py-1 text-xs font-bold bg-cyan-950 text-cyan-400 border border-cyan-900/60 rounded-lg">
                    {CATEGORY_LABELS[selectedProduct.category]}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-white">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">حالة التوفر:</span>
                    {selectedProduct.stock ? (
                      <span className="text-xs text-emerald-400 font-bold">متوفر ومتاح فوراً في الفرع</span>
                    ) : (
                      <span className="text-xs text-rose-400 font-bold">غير متوفر حالياً (طلب مسبق)</span>
                    )}
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <span className="text-slate-500 text-xs block mb-1">سعر البيع النهائي</span>
                    <span className="font-mono text-xl md:text-2xl font-black text-cyan-400">
                      ${selectedProduct.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 text-right">
                <h4 className="font-bold text-slate-200">وصف ومزايا الجهاز:</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedProduct.description}</p>
              </div>

              {/* Bullet Specs */}
              <div className="space-y-3 text-right">
                <h4 className="font-bold text-slate-200">المواصفات والخصائص المعاينة:</h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-950/80">
                  <ul className="space-y-2 text-xs md:text-sm text-slate-400 font-mono">
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2 text-right justify-start">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Inquiry Action Buttons Footer */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleInquiry(selectedProduct)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-extrabold hover:opacity-95 transition cursor-pointer"
                >
                  <MessageSquareCode className="w-5 h-5 flex-shrink-0" />
                  <span>تواصل من أجل الشراء والاستفسار</span>
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-bold transition cursor-pointer"
                >
                  إغلاق التبويب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MULTIPLE SPECIFICATIONS COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
                مقارنة مواصفات الأجهزة المختارة
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Table Body */}
            <div className="overflow-x-auto p-6">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="py-4 px-4 text-slate-500 font-bold w-1/4">الخصائص المحددة</th>
                    {compareList.map(prod => (
                      <th key={prod.id} className="py-4 px-4 text-cyan-400 font-extrabold text-center w-1/4">
                        {prod.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold bg-slate-950/20">الفئة البرمجية</td>
                    {compareList.map(prod => (
                      <td key={prod.id} className="py-3.5 px-4 text-slate-400 text-center">
                        {CATEGORY_LABELS[prod.category]}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold bg-slate-950/20">صورة المعاينة</td>
                    {compareList.map(prod => (
                      <td key={prod.id} className="py-3.5 px-4 text-center">
                        <img src={prod.image} alt="" className="h-16 w-24 object-cover rounded-lg mx-auto border border-slate-800" />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold bg-slate-950/20">السعر المقدر</td>
                    {compareList.map(prod => (
                      <td key={prod.id} className="py-3.5 px-4 text-center text-emerald-400 font-mono font-bold">
                        ${prod.price.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold bg-slate-950/20">حالة التواجد</td>
                    {compareList.map(prod => (
                      <td key={prod.id} className="py-3.5 px-4 text-center">
                        {prod.stock ? (
                          <span className="text-xs text-emerald-400 font-bold">متوفر</span>
                        ) : (
                          <span className="text-xs text-rose-400 font-bold">نفد من المخزون</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-slate-300 font-semibold align-top bg-slate-950/20">المواصفات التفصيلية</td>
                    {compareList.map(prod => (
                      <td key={prod.id} className="py-4 px-4 text-slate-400 text-xs font-mono space-y-1 align-top text-right">
                        {prod.specs.map((item, id) => (
                          <div key={id} className="flex gap-1.5 items-start">
                            <span className="text-cyan-500">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-300 bg-slate-950/20">إجراء سريع</td>
                    {compareList.map(prod => (
                      <td key={prod.id} className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedProduct(prod);
                            setShowCompareModal(false);
                          }}
                          className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          تصفح وتفاصيل
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
              <button
                onClick={() => setCompareList([])}
                className="px-4 py-2 bg-rose-950 text-rose-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-900"
              >
                مسح الكل
              </button>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-750"
              >
                إغلاق المقارنة
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
