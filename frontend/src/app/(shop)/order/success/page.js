'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, Package } from 'lucide-react';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';

function OrderSuccessInner() {
  const sp = useSearchParams();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const id = sp.get('id');
  const number = sp.get('number');

  return (
    <section className="container-app py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-50 mx-auto flex items-center justify-center mb-6 animate-fade-in">
          <CheckCircle2 className="w-14 h-14 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-brand-900 mb-2">{t.checkout.orderSuccess}</h1>
        <p className="text-gray-600 mb-6">{t.checkout.thankYou}</p>

        {number && (
          <div className="card p-6 mb-6">
            <div className="text-sm text-gray-500 mb-1">{t.checkout.orderNumber}</div>
            <div className="text-2xl font-bold text-brand-900 tracking-wider">{number}</div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {id && (
            <Link href={`/account/orders/${id}`} className="btn btn-primary btn-md">
              <Package className="w-4 h-4" />{t.checkout.viewOrder}
            </Link>
          )}
          <Link href="/" className="btn btn-outline btn-md">
            <Home className="w-4 h-4" />{t.nav.home}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function OrderSuccessPage() {
  return <Suspense><OrderSuccessInner /></Suspense>;
}
