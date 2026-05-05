'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { ProductGrid, ProductGridSkeleton } from '@/components/ProductGrid';
import { ProductFilters } from '@/components/ProductFilters';

export default function CategoryPage() {
  const { slug } = useParams();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: 'newest', size: '', color: '', min: '', max: '' });
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    api.get(`/categories/${slug}`).then(d => setCategory(d.category)).catch(() => {});
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams({
      sub: slug,
      page: '1', limit: '24',
      ...(filters.sort && { sort: filters.sort }),
      ...(filters.size && { size: filters.size }),
      ...(filters.color && { color: filters.color }),
      ...(filters.min && { min: String(filters.min) }),
      ...(filters.max && { max: String(filters.max) }),
    });
    api.get(`/products?${qs}`)
      .then(d => { setProducts(d.products); setPagination(d.pagination); })
      .finally(() => setLoading(false));
  }, [slug, filters]);

  return (
    <>
      {/* Category banner */}
      {category && (
        <section className="relative h-56 sm:h-72 bg-brand-100 overflow-hidden">
          {category.image_url && (
            <Image src={category.image_url} alt={isAr ? category.name_ar : category.name_en} fill className="object-cover" sizes="100vw" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/40 to-brand-950/10" />
          <div className="absolute inset-0 container-app flex flex-col justify-end pb-6">
            <nav className="text-xs text-brand-100 mb-2 flex items-center gap-2">
              <Link href="/" className="hover:text-accent-300">{t.nav.home}</Link>
              <span>/</span>
              <span className="text-white">{isAr ? category.name_ar : category.name_en}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {isAr ? category.name_ar : category.name_en}
            </h1>
            {category.description_ar && (
              <p className="text-brand-100 text-sm mt-1 max-w-xl">
                {isAr ? category.description_ar : category.description_en}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Subcategories */}
      {category?.children?.length > 0 && (
        <section className="container-app pt-6">
          <div className="flex flex-wrap gap-2">
            <Link href={`/category/${category.slug}`} className="chip bg-brand-900 text-white border-brand-900">
              {isAr ? 'الكل' : 'All'}
            </Link>
            {category.children.map(c => (
              <Link key={c.id} href={`/category/${c.slug}`} className="chip hover:border-brand-300 hover:bg-brand-50">
                {isAr ? c.name_ar : c.name_en}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filters + Grid */}
      <section className="container-app py-6 grid lg:grid-cols-[260px_1fr] gap-6">
        <ProductFilters values={filters} onChange={setFilters} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              {isAr ? `${pagination.total} منتج` : `${pagination.total} products`}
            </span>
          </div>
          {loading ? <ProductGridSkeleton /> : products.length ? <ProductGrid products={products} /> : (
            <div className="text-center py-20 text-gray-500">
              <div className="text-lg font-bold text-brand-900 mb-1">{t.filters.noResults}</div>
              <div className="text-sm">{t.filters.tryDifferent}</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
