'use client';

import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { useUI } from '@/lib/store';

export default function EditProductPage() {
  const { id } = useParams();
  const { locale } = useUI();
  return (
    <div>
      <h1 className="text-xl font-bold text-brand-900 mb-4">{locale === 'ar' ? 'تعديل منتج' : 'Edit product'}</h1>
      <ProductForm productId={id} />
    </div>
  );
}
