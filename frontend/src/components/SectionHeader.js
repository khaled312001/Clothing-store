'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useUI } from '@/lib/store';

export function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel }) {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1 h-7 bg-gradient-to-b from-accent-400 to-accent-600 rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-900">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-sm font-bold text-brand-700 hover:text-accent-600 flex items-center gap-1.5 whitespace-nowrap group transition">
          {viewAllLabel}
          <Arrow className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
