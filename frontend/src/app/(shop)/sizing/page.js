'use client';

import { useState } from 'react';
import { Ruler, ArrowLeftRight, ArrowDown, ArrowUpDown, Shirt } from 'lucide-react';
import { useUI } from '@/lib/store';
import { cn } from '@/lib/utils';

const SIZE_TABLES = {
  women: {
    title_ar: 'حريمي',
    title_en: 'Women',
    headers: ['Size', 'Bust (cm)', 'Waist (cm)', 'Hip (cm)'],
    headers_ar: ['المقاس', 'الصدر (سم)', 'الخصر (سم)', 'الورك (سم)'],
    rows: [
      ['XS', '76-80', '60-64', '84-88'],
      ['S',  '80-84', '64-68', '88-92'],
      ['M',  '84-88', '68-72', '92-96'],
      ['L',  '88-94', '72-78', '96-102'],
      ['XL', '94-100','78-84', '102-108'],
      ['XXL','100-106','84-90','108-114'],
    ],
  },
  men: {
    title_ar: 'رجالي',
    title_en: 'Men',
    headers: ['Size', 'Chest (cm)', 'Waist (cm)', 'Pants size'],
    headers_ar: ['المقاس', 'الصدر (سم)', 'الخصر (سم)', 'مقاس البنطلون'],
    rows: [
      ['S',   '88-92',  '72-76',  '30'],
      ['M',   '92-96',  '76-82',  '32'],
      ['L',   '96-102', '82-88',  '34'],
      ['XL',  '102-108','88-94',  '36'],
      ['XXL', '108-114','94-100', '38'],
    ],
  },
  kids: {
    title_ar: 'أطفالي',
    title_en: 'Kids',
    headers: ['Age', 'Height (cm)', 'Chest (cm)', 'Size label'],
    headers_ar: ['العمر', 'الطول (سم)', 'الصدر (سم)', 'تسمية المقاس'],
    rows: [
      ['0-3 m',   '50-62',  '38-42', '0-3M'],
      ['3-6 m',   '62-68',  '42-44', '3-6M'],
      ['6-12 m',  '68-78',  '44-48', '6-12M'],
      ['2-3 y',   '88-98',  '52-56', '3Y'],
      ['4-5 y',   '104-114','56-60', '4-5Y'],
      ['6-7 y',   '116-122','60-64', '6-7Y'],
      ['8-9 y',   '128-134','66-70', '8-9Y'],
      ['10-11 y', '140-146','72-76', '10-11Y'],
      ['12-13 y', '152-158','78-82', '12-13Y'],
    ],
  },
};

export default function SizingPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [active, setActive] = useState('women');

  const table = SIZE_TABLES[active];

  return (
    <section className="container-app py-10 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
          <Ruler className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-900 mb-3">{isAr ? 'دليل المقاسات' : 'Size Guide'}</h1>
        <p className="text-gray-600">{isAr ? 'كيف تختار المقاس الصحيح في كل مرة' : 'How to choose the right size every time'}</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {Object.keys(SIZE_TABLES).map(k => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={cn(
              'px-5 py-2 rounded-xl font-bold transition',
              active === k ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 hover:border-brand-300'
            )}
          >
            {isAr ? SIZE_TABLES[k].title_ar : SIZE_TABLES[k].title_en}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-900 text-white">
            <tr>
              {(isAr ? table.headers_ar : table.headers).map((h, i) => (
                <th key={i} className="text-start px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className={cn('border-t', i % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                {row.map((cell, j) => (
                  <td key={j} className={cn('px-4 py-3', j === 0 && 'font-bold text-brand-700')}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-6 mt-8">
        <h3 className="font-bold text-brand-900 mb-3">{isAr ? 'كيف تقيس بدقة؟' : 'How to measure accurately?'}</h3>
        <ul className="space-y-3 text-sm text-brand-800">
          {[
            { Icon: ArrowLeftRight, label: isAr ? 'الصدر:' : 'Chest:', text: isAr ? 'قس حول أعرض جزء من الصدر مع إبقاء شريط القياس مستوياً.' : 'Measure around the fullest part of the chest, keeping tape level.' },
            { Icon: ArrowLeftRight, label: isAr ? 'الخصر:' : 'Waist:', text: isAr ? 'قس عند أضيق نقطة (عادة فوق السرة).' : 'Measure at the narrowest point (usually above the navel).' },
            { Icon: ArrowLeftRight, label: isAr ? 'الورك:' : 'Hip:', text: isAr ? 'قس حول أعرض جزء من الورك.' : 'Measure around the widest part of the hips.' },
            { Icon: ArrowUpDown, label: isAr ? 'الطول:' : 'Height:', text: isAr ? 'قف بشكل مستقيم بدون حذاء وقس من القمة للأسفل.' : 'Stand straight without shoes and measure from top to bottom.' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <item.Icon className="w-4 h-4" />
              </span>
              <span><strong>{item.label}</strong> {item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
