export type DeviceCategory = 'phone' | 'laptop' | 'phone_accessory' | 'laptop_accessory';

export interface Product {
  id: string;
  name: string;
  category: DeviceCategory;
  price: number;
  description: string;
  image: string;
  specs: string[];
  stock: boolean;
  featured?: boolean;
}

export type RepairStatus = 'pending' | 'received' | 'diagnostic' | 'repairing' | 'completed' | 'collected';

export interface RepairRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  category: string;
  description: string;
  images: string[]; // Base64 or local object URLs
  status: RepairStatus;
  cost?: number;
  adminNotes?: string;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<DeviceCategory, string> = {
  phone: 'هواتف ذكية',
  laptop: 'حواسيب محمولة',
  phone_accessory: 'إكسسوارات هواتف',
  laptop_accessory: 'إكسسوارات حواسيب',
};

export const REPAIR_STATUS_LABELS: Record<RepairStatus, { label: string; color: string }> = {
  pending: { label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-800 border-amber-200 uppercase' },
  received: { label: 'تم الاستلام', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  diagnostic: { label: 'قيد الفحص وتحديد العطل', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  repairing: { label: 'جاري الإصلاح والعمل عليها', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  completed: { label: 'جاهز للاستلام', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  collected: { label: 'تم التسليم والانتهاء', color: 'bg-slate-100 text-slate-800 border-slate-200' },
};
