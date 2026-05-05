'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import { useUI } from '@/lib/store';

export default function NewProductPage() {
  const { locale } = useUI();
  return (
    <div>
      <h1 className="text-xl font-bold text-brand-900 mb-4">{locale === 'ar' ? 'إضافة منتج جديد' : 'Add new product'}</h1>
      <ProductForm />
    </div>
  );
}
