import { Product, RepairRequest } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'آيفون 15 برو ماكس (256 جيجابايت)',
    category: 'phone',
    price: 1499,
    description: 'أقوى هاتف آيفون على الإطلاق بتصميم من التيتانيوم المتين، شريحة A17 Pro الخارقة، ونظام كاميرات احترافي متطور يتيح تقريب بصري يصل إلى 5x.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    specs: [
      'شاشة 6.7 بوصة Super Retina XDR مع ProMotion',
      'معالج A17 Pro بـ 6 أنوية',
      'كاميرا رئيسية 48 ميجابيكسل ذات زاوية واسعة للغاية',
      'مقاومة الغبار والماء بمعيار IP68',
      'منفذ USB-C الجديد كلياً لنقل سريع للبيانات'
    ],
    stock: true,
    featured: true
  },
  {
    id: 'p2',
    name: 'سامسونج جالكسي S24 ألترا',
    category: 'phone',
    price: 1399,
    description: 'أذكى هاتف ذكي مجهز بتقنيات Galaxy AI الكاملة، مع قلم S Pen مدمج، وتصميم جبار من التيتانيوم ومقاومة شديدة للخدوش والانعكاسات.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
    specs: [
      'شاشة 6.8 بوصة Dynamic AMOLED 2X بسرعة 120Hz',
      'معالج Snapdragon 8 Gen 3 المخصص لجالكسي',
      'كاميرا رباعية بدقة تصل إلى 200 ميجابكسل',
      'قلم S Pen مدمج مع دعم ميزات الذكاء الاصطناعي',
      'بطارية ضخمة بسعة 5000 مللي أمبير مع شحن سريع'
    ],
    stock: true,
    featured: true
  },
  {
    id: 'p3',
    name: 'ماك بوك برو 14 بوصة بـ معالج M3',
    category: 'laptop',
    price: 1799,
    description: 'لابتوب الاحترافيين الأقوى في فئته بفضل معالج Apple M3 المبتكر، كفاءة طاقة منقطعة النظير، وشاشة Liquid Retina XDR الأكثر سطوعاً.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600',
    specs: [
      'معالج Apple M3 مع وحدة معالجة رسومات بـ 10 أنوية',
      'ذاكرة موحدة بسعة 16 جيجابايت لتجربة سلسلة',
      'سعة تخزين 512 جيجابايت SSD فائقة السرعة',
      'بطارية تدوم حتى 22 ساعة من العمل المتواصل',
      'شاشة Liquid Retina XDR بمعدل تحديث 120 هرتز'
    ],
    stock: true,
    featured: true
  },
  {
    id: 'p4',
    name: 'سماعات آبل AirPods Pro 2 (USB‑C)',
    category: 'phone_accessory',
    price: 249,
    description: 'أفضل تجربة عزل ضوضاء نشط في العالم، مع ميزة الصوت التكيفي والشفافية المحدثة، وعلبة شحن الذكية تتبع الأثر باستخدام منفذ USB-C.',
    image: 'https://images.unsplash.com/photo-1588449668338-d13417f16bf4?auto=format&fit=crop&q=80&w=600',
    specs: [
      'شريحة H2 المحدثة للصوت والعزل الذكي',
      'ميزة حجب الضوضاء تبلغ ضعفي الإصدار السابق',
      'صوت مكاني مخصص يتكيف مع شكل أذنيك',
      'مدة استماع تصل إلى 6 ساعات بشحنة واحدة',
      'علبة شحن MagSafe مقاومة للماء والعرق بوزن خفيف'
    ],
    stock: true,
    featured: false
  },
  {
    id: 'p5',
    name: 'لابتوب آسوس ROG Strix للألعاب',
    category: 'laptop',
    price: 1999,
    description: 'وحش الألعاب والمونتاج الاحترافي، مصمم لتوفير أقصى قدر من الأداء بفضل معالج إنتل كور i9 وبطاقة رسومات RTX 4070 المذهلة مع تبريد ذكي سائل.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600',
    specs: [
      'معالج Intel Core i9-14900HX فائق السرعة',
      'بطاقة رسومات NVIDIA GeForce RTX 4070 بذاكرة 8GB',
      'ذاكرة عشوائية 32 جيجابايت DDR5',
      'شاشة مقاس 16 بوصة بدقة QHD+ وتردد 240Hz',
      'نظام تبريد ROG Intelligent Cooling مع تبريد معدني سائل'
    ],
    stock: true,
    featured: true
  },
  {
    id: 'p6',
    name: 'شاحن أنكر MagGo المغناطيسي اللاسلكي السريع',
    category: 'phone_accessory',
    price: 59,
    description: 'قاعدة شحن مغنطيسية تلتصق بالهاتف مباشرة مدعومة بتقنية Qi2 لتقديم شحن لاسلكي سريع ومستقر بقوة 15 واط مع شاشة لمراقبة الشحن.',
    image: 'https://images.unsplash.com/photo-1622445262465-24819af5222e?auto=format&fit=crop&q=80&w=600',
    specs: [
      'شحن Qi2 معتمد بقوة 15 واط (أسرع بمرتين)',
      'التصاق مغناطيسي آمن وفائق القوة لهواتف الآيفون والسامسونج',
      'تصميم مدمج مع مسند مدمج متعدد الزوايا لإسناد الهاتف',
      'الحماية الفائقة ActiveShield 2.0 لمراقبة الحرارة الذكية',
      'تتضمن كابل USB-C وشاحن حائط مجاني'
    ],
    stock: true,
    featured: false
  },
  {
    id: 'p7',
    name: 'محول منافذ (Hub) متعدد الاستخدامات للابتوب من يوجرين',
    category: 'laptop_accessory',
    price: 45,
    description: 'قم بتوسيع إمكانيات جهاز الماك بوك أو الحاسوب المحمول الخاص بك عبر هذا المحور الأنيق المصنوع من الألمنيوم والذي يمنحك 7 منافذ إضافية في منفذ واحد.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
    specs: [
      'منفذ HDMI يدعم دقة 4K بمعدل تحديث 60Hz',
      'منفذ USB-C يدعم الشحن السريع بقوة 100W PD',
      'منفذان USB 3.0 لنقل البيانات بسرعة 5Gbps',
      'قارئ بطاقات SD وقارئ بطاقات TF مدمجين',
      'هيكل معدني قوي يبدد الحرارة لمنع الاختناق وتلف الأجهزة'
    ],
    stock: true,
    featured: false
  },
  {
    id: 'p8',
    name: 'فأرة لوجيتك MX Master 3S الاحترافية للمصممين والمبرمجين',
    category: 'laptop_accessory',
    price: 119,
    description: 'أفضل فأرة إنتاجية في السوق على الإطلاق بمستشعر بدقة 8K DPI يعود بدقة لا تصدق ليعمل على أي سطح بما في ذلك الزجاج وعجلة تمرير مغناطيسية صامتة لا تصدق.',
    image: 'https://images.unsplash.com/photo-1527866990279-b0c6efb34d17?auto=format&fit=crop&q=80&w=600',
    specs: [
      'مستشعر ليزري بدقة 8000 DPI يعمل على كافة الأسطح والزجاج',
      'عجلة تمرير MagSpeed الكهرومغناطيسية الهادئة والسريعة للغاية',
      'مفاتيح صامتة كلياً بنسبة ضجيج أقل بـ 90%',
      'إمكانية الاقتران والتنقل بين 3 أجهزة مختلفة (سواء ماك أو ويندوز)',
      'شحن سريع USB-C يدعم 70 يوماً من الاستخدام بشحنة كاملة واحدة'
    ],
    stock: true,
    featured: true
  }
];

export const INITIAL_REPAIR_REQUESTS: RepairRequest[] = [
  {
    id: 'r1',
    customerName: 'أحمد السعيد',
    customerPhone: '0555123456',
    deviceModel: 'ماك بوك برو 16 بوصة 2021',
    category: 'laptop',
    description: 'انكسار الجزء السفلي من الشاشة وتذبذب الإضاءة الخلفية مع ظهور خطوط عمودية بعد سقوط طفيف للجهاز على جانبه.',
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600'],
    status: 'repairing',
    cost: 450,
    adminNotes: 'شاشة LCD متضررة بالكامل. تم طلب شاشة بديلة أصلية من المورد، وعند وصولها سنقوم بتركيبها والتأكد من عدم وجود مشاكل أخرى في لوحة الفتحة.',
    createdAt: '2026-06-05T10:30:00Z'
  },
  {
    id: 'r2',
    customerName: 'سارة خالد',
    customerPhone: '0666987654',
    deviceModel: 'آيفون 13 عادي',
    category: 'phone',
    description: 'تدهور كبير في صحة البطارية لتبلغ 74% فقط، الهاتف يسخن بسرعة هائلة عند الشحن وينطفئ فجأة عند الوصول لنسبة 20%.',
    images: [],
    status: 'completed',
    cost: 80,
    adminNotes: 'تم تبديل البطارية بأخرى أصلية بنجاح بنسبة صحة 100% مع تركيب طوق عازل للماء جديد وفحص دورة الشحن، كل الاختبارات سليمة تماماً وتم تجربة شاحن يدعم الشحن السريع بنجاح.',
    createdAt: '2026-06-07T08:15:00Z'
  }
];
