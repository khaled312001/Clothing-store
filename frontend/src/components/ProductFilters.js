'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X, Check } from 'lucide-react';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

const COMMON_SIZES = ['XS','S','M','L','XL','XXL','30','32','34','36','38','4Y','6Y','8Y','10Y','12Y','0-3M','3-6M','6-9M','9-12M','OneSize'];
const COMMON_COLORS = [
  { name: 'Black', hex: '#0f0f0f', ar: 'أسود' },
  { name: 'White', hex: '#ffffff', ar: 'أبيض' },
  { name: 'Navy',  hex: '#1e3a5f', ar: 'كحلي' },
  { name: 'Gray',  hex: '#6b7280', ar: 'رمادي' },
  { name: 'Red',   hex: '#dc2626', ar: 'أحمر' },
  { name: 'Blue',  hex: '#2563eb', ar: 'أزرق' },
  { name: 'Pink',  hex: '#ec4899', ar: 'وردي' },
  { name: 'Green', hex: '#16a34a', ar: 'أخضر' },
  { name: 'Beige', hex: '#d6c8a8', ar: 'بيج' },
  { name: 'Brown', hex: '#7c4a2a', ar: 'بني' },
  { name: 'Olive', hex: '#556b2f', ar: 'زيتي' },
];

const PRICE_PRESETS = [
  { label: '0–200',   min: 0,    max: 200 },
  { label: '200–500', min: 200,  max: 500 },
  { label: '500–1K',  min: 500,  max: 1000 },
  { label: '1K–2K',   min: 1000, max: 2000 },
  { label: '2K+',     min: 2000, max: '' },
];

function Section({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-2.5 group"
      >
        <span className="text-sm font-bold text-brand-900 group-hover:text-brand-600 transition flex items-center gap-1.5">
          {title}
          {count > 0 && <span className="bg-brand-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition', open && 'rotate-180 text-brand-600')} />
      </button>
      <div className={cn('overflow-hidden transition-all', open ? 'max-h-[500px] pb-3' : 'max-h-0')}>
        {children}
      </div>
    </div>
  );
}

function FiltersBody({ values, onChange, t, isAr }) {
  const update = (k, v) => onChange({ ...values, [k]: v });
  const clear  = () => onChange({ sort: 'newest', size: '', color: '', min: '', max: '' });

  // Active filter count (excluding sort)
  const activeCount = ['size','color','min','max'].filter(k => values[k] !== '' && values[k] != null).length;

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <h3 className="font-bold text-brand-900 text-sm flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          {t.filters.title}
          {activeCount > 0 && <span className="bg-accent-400 text-brand-950 text-[10px] font-bold rounded-full px-1.5 py-0.5">{activeCount}</span>}
        </h3>
        <button onClick={clear} className="text-xs text-brand-600 hover:underline disabled:opacity-30" disabled={activeCount === 0 && values.sort === 'newest'}>
          {t.filters.clear}
        </button>
      </div>

      {/* Sort - inline pill style */}
      <Section title={t.filters.sort} defaultOpen>
        <select className="input h-9 text-sm w-full" value={values.sort} onChange={(e) => update('sort', e.target.value)}>
          {Object.entries(t.filters.sortOptions).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
      </Section>

      {/* Price - presets + custom range */}
      <Section title={t.filters.price} count={(values.min !== '' || values.max !== '') ? 1 : 0} defaultOpen>
        <div className="flex flex-wrap gap-1 mb-2">
          {PRICE_PRESETS.map(p => {
            const active = String(values.min) === String(p.min) && String(values.max) === String(p.max);
            return (
              <button
                key={p.label}
                onClick={() => update('sort', values.sort) || onChange({ ...values, min: p.min, max: p.max })}
                className={cn(
                  'px-2.5 py-1 text-xs rounded-full border transition',
                  active ? 'border-brand-700 bg-brand-700 text-white' : 'border-gray-200 hover:border-brand-300'
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-1.5">
          <input type="number" min="0" placeholder={isAr ? 'من' : 'min'} value={values.min} onChange={(e) => update('min', e.target.value)} className="input h-8 text-xs" />
          <input type="number" min="0" placeholder={isAr ? 'إلى' : 'max'} value={values.max} onChange={(e) => update('max', e.target.value)} className="input h-8 text-xs" />
        </div>
      </Section>

      {/* Size */}
      <Section title={t.filters.size} count={values.size ? 1 : 0} defaultOpen>
        <div className="grid grid-cols-5 gap-1">
          {COMMON_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => update('size', values.size === s ? '' : s)}
              className={cn(
                'h-8 text-[11px] rounded-md border transition font-semibold',
                values.size === s
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-gray-200 hover:border-brand-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      {/* Color */}
      <Section title={t.filters.color} count={values.color ? 1 : 0} defaultOpen>
        <div className="grid grid-cols-6 gap-1.5">
          {COMMON_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => update('color', values.color === c.name ? '' : c.name)}
              title={isAr ? c.ar : c.name}
              className={cn(
                'aspect-square rounded-full border-2 transition relative flex items-center justify-center',
                values.color === c.name ? 'border-brand-700 ring-2 ring-brand-200 scale-110' : 'border-gray-200 hover:border-brand-400 hover:scale-105'
              )}
              style={{ backgroundColor: c.hex }}
            >
              {values.color === c.name && (
                <Check className="w-3 h-3" style={{ color: c.hex === '#ffffff' || c.hex === '#d6c8a8' ? '#000' : '#fff' }} />
              )}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

export function ProductFilters({ values, onChange }) {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = ['size','color','min','max'].filter(k => values[k] !== '' && values[k] != null).length;

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden btn btn-outline btn-md w-full mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {t.filters.title}
        {activeCount > 0 && <span className="bg-accent-400 text-brand-950 text-[10px] font-bold rounded-full px-1.5 py-0.5 ms-1">{activeCount}</span>}
      </button>

      {/* Desktop sidebar — sticky, dense, no scroll needed */}
      <aside className="hidden lg:block lg:sticky lg:top-44 self-start bg-white rounded-2xl shadow-card px-4 py-2 h-fit">
        <FiltersBody values={values} onChange={onChange} t={t} isAr={isAr} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-y-0 end-0 w-[88%] max-w-sm bg-white shadow-2xl flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-brand-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" />{t.filters.title}</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <FiltersBody values={values} onChange={onChange} t={t} isAr={isAr} />
            </div>
            <div className="p-3 border-t bg-white">
              <button onClick={() => setMobileOpen(false)} className="btn btn-primary btn-md w-full">
                {isAr ? 'عرض النتائج' : 'Show results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
