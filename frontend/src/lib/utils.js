import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value, locale = 'ar') {
  const n = Number(value);
  if (Number.isNaN(n)) return '';
  const formatted = n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return locale === 'ar' ? `${formatted} ج.م` : `${formatted} EGP`;
}

export function discountPercent(price, compare) {
  if (!compare || Number(compare) <= Number(price)) return 0;
  return Math.round((1 - Number(price) / Number(compare)) * 100);
}

export function formatDate(date, locale = 'ar') {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export const STATUS_LABELS = {
  ar: {
    pending: 'قيد المراجعة', confirmed: 'مؤكد', processing: 'قيد التجهيز',
    shipped: 'قيد الشحن', delivered: 'تم التسليم', cancelled: 'ملغي', refunded: 'مرتجع',
  },
  en: {
    pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded',
  },
};

export const STATUS_COLORS = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  confirmed:  'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled:  'bg-red-50 text-red-700 border-red-200',
  refunded:   'bg-gray-50 text-gray-700 border-gray-200',
};
