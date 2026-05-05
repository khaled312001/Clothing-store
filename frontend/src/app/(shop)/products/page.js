'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { ProductGrid, ProductGridSkeleton } from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';

function ProductsPageInner() {
  const sp = useSearchParams();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';

  const initialQ = sp.get('q') || '';
  const initialSort = sp.get('sort') || 'newest';
  const initialFeatured = sp.get('featured') === '1';
  const initialIsNew = sp.get('isNew') === '1';

  const [filters, setFilters] = useState({ sort: initialSort, size: '', color: '', min: '', max: '' });
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({
      page: '1', limit: '24',
      ...(filters.sort && { sort: filters.sort }),
      ...(filters.size && { size: filters.size }),
      ...(filters.color && { color: filters.color }),
      ...(filters.min && { min: String(filters.min) }),
      ...(filters.max && { max: String(filters.max) }),
      ...(initialQ && { q: initialQ }),
      ...(initialFeatured && { featured: '1' }),
      ...(initialIsNew && { isNew: '1' }),
    });
    api.get(`/products?${qs}`)
      .then(d => { setProducts(d.products); setPagination(d.pagination); })
      .finally(() => setLoading(false));
  }, [filters, initialQ, initialFeatured, initialIsNew]);

  const title = initialQ
    ? (isAr ? `نتائج البحث عن: ${initialQ}` : `Results for: ${initialQ}`)
    : initialFeatured ? t.sections.featured
    : initialIsNew ? t.sections.newArrivals
    : (isAr ? 'كل المنتجات' : 'All Products');

  return (
    <section className="container-app py-8 grid lg:grid-cols-[260px_1fr] gap-6">
      <ProductFilters values={filters} onChange={setFilters} />
      <div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-brand-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isAr ? `${pagination.total} منتج` : `${pagination.total} products`}
          </p>
        </div>
        {loading ? <ProductGridSkeleton /> : products.length ? <ProductGrid products={products} /> : (
          <div className="text-center py-20 text-gray-500">
            <div className="text-lg font-bold text-brand-900 mb-1">{t.filters.noResults}</div>
            <div className="text-sm">{t.filters.tryDifferent}</div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-app py-8"><ProductGridSkeleton /></div>}>
      <ProductsPageInner />
    </Suspense>
  );
}
