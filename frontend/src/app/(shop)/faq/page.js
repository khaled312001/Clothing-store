'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useUI } from '@/lib/store';
import { cn } from '@/lib/utils';

const FAQS_AR = [
  { q: 'كم تستغرق مدة التوصيل؟', a: 'يتم توصيل الطلب خلال 2-5 أيام عمل في القاهرة والجيزة، و3-7 أيام لباقي المحافظات.' },
  { q: 'هل يمكنني إرجاع المنتج؟', a: 'نعم، يمكنك إرجاع أو استبدال أي منتج خلال 14 يوم من تاريخ الاستلام بشرط أن يكون بحالته الأصلية وبكامل ملحقاته.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل: فيزا، ماستركارد، ميزا، فوري، باي موب، فودافون كاش، إنستا باي، والدفع عند الاستلام.' },
  { q: 'هل الشحن مجاني؟', a: 'نعم، الشحن مجاني لجميع الطلبات التي تتجاوز قيمتها 1500 جنيه. الطلبات الأقل تخضع لرسوم شحن 60 جنيه.' },
  { q: 'كيف أتأكد من المقاس الصحيح؟', a: 'لدينا دليل مقاسات مفصل لكل قسم. يمكنك أيضاً التواصل مع خدمة العملاء للحصول على نصيحة شخصية.' },
  { q: 'هل المنتجات أصلية؟', a: 'نعم، جميع منتجاتنا أصلية ومضمونة بنسبة 100%. نحرص على اختيار أفضل الخامات والماركات.' },
  { q: 'كيف يمكنني تتبع طلبي؟', a: 'بعد إتمام الطلب ستحصل على رقم تتبع عبر الإيميل/SMS، ويمكنك متابعة حالة الطلب من حسابك الشخصي.' },
  { q: 'هل تشحنون خارج مصر؟', a: 'حالياً نخدم داخل جمهورية مصر العربية فقط. نخطط للتوسع قريباً لدول الخليج.' },
];
const FAQS_EN = [
  { q: 'How long does delivery take?', a: 'Orders ship within 2-5 working days for Cairo & Giza, 3-7 days for other governorates.' },
  { q: 'Can I return a product?', a: 'Yes, you can return or exchange any item within 14 days of delivery, provided it is in original condition with all accessories.' },
  { q: 'What payment methods are available?', a: 'We accept Visa, Mastercard, Meeza, Fawry, Paymob, Vodafone Cash, InstaPay, and Cash on Delivery.' },
  { q: 'Is shipping free?', a: 'Yes, shipping is free for orders over 1500 EGP. Smaller orders have a 60 EGP shipping fee.' },
  { q: 'How do I find my correct size?', a: 'We have a detailed size guide per category. You can also contact customer service for personal advice.' },
  { q: 'Are the products genuine?', a: '100% genuine and guaranteed. We carefully select the best fabrics and brands.' },
  { q: 'How can I track my order?', a: 'After ordering you receive a tracking number via Email/SMS, and you can follow the status from your account.' },
  { q: 'Do you ship outside Egypt?', a: 'Currently we serve inside Egypt only. We plan to expand to the Gulf soon.' },
];

export default function FaqPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const list = isAr ? FAQS_AR : FAQS_EN;
  const [open, setOpen] = useState(0);

  return (
    <section className="container-app py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-brand-900 mb-3 text-center">{isAr ? 'الأسئلة الشائعة' : 'FAQ'}</h1>
        <p className="text-center text-gray-600 mb-10">{isAr ? 'إجابات على أكثر الأسئلة طرحاً من عملائنا' : 'Answers to our most-asked questions'}</p>

        <div className="space-y-3">
          {list.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full p-5 flex items-center justify-between gap-4 text-start">
                <span className="font-bold text-brand-900">{f.q}</span>
                <ChevronDown className={cn('w-5 h-5 transition shrink-0', open === i && 'rotate-180 text-brand-600')} />
              </button>
              <div className={cn('overflow-hidden transition-all', open === i ? 'max-h-96' : 'max-h-0')}>
                <div className="px-5 pb-5 text-brand-700 leading-relaxed">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
