import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useUI } from '@/lib/store';

export function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 whitespace-nowrap">
          {viewAllLabel}
          <span className="rtl-only">←</span>
          <span className="ltr-only">→</span>
        </Link>
      )}
    </div>
  );
}
