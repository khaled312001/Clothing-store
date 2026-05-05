'use client';

import { RotateCcw, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import { useUI } from '@/lib/store';

export default function ReturnsPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';

  const allowed = isAr ? [
    'المنتجات بحالتها الأصلية وغير مستعملة',
    'مع التغليف الأصلي وكل الملحقات',
    'خلال 14 يوم من تاريخ الاستلام',
    'مع فاتورة الشراء أو رقم الطلب',
  ] : [
    'Products in original condition, unused',
    'With original packaging and all accessories',
    'Within 14 days of delivery date',
    'With purchase invoice or order number',
  ];

  const notAllowed = isAr ? [
    'الملابس الداخلية والمايوهات',
    'المنتجات المخصصة أو المعدّلة',
    'المنتجات المغسولة أو المستخدمة',
    'المنتجات المعروضة بسعر التخفيضات النهائية',
  ] : [
    'Underwear and swimwear',
    'Custom or altered items',
    'Washed or used items',
    'Items on final-sale clearance',
  ];

  return (
    <section className="container-app py-10 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <RotateCcw className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-900 mb-3">{isAr ? 'سياسة الإرجاع والاستبدال' : 'Returns & Exchange Policy'}</h1>
        <p className="text-gray-600">{isAr ? 'رضاك يهمنا — لديك 14 يوم كاملة للإرجاع أو الاستبدال' : 'Your satisfaction matters — you have a full 14 days for returns or exchange'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="card p-6 border-s-4 border-emerald-500">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h2 className="font-bold text-brand-900 text-lg">{isAr ? 'يمكن الإرجاع' : 'Returnable'}</h2>
          </div>
          <ul className="space-y-2 text-brand-800 text-sm">
            {allowed.map((a, i) => (
              <li key={i} className="flex gap-2 items-start"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{a}</li>
            ))}
          </ul>
        </div>
        <div className="card p-6 border-s-4 border-red-500">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
            <h2 className="font-bold text-brand-900 text-lg">{isAr ? 'لا يمكن الإرجاع' : 'Non-returnable'}</h2>
          </div>
          <ul className="space-y-2 text-brand-800 text-sm">
            {notAllowed.map((a, i) => (
              <li key={i} className="flex gap-2 items-start"><XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-brand-900 mb-4">{isAr ? 'خطوات الإرجاع' : 'Return steps'}</h2>
        <ol className="space-y-3">
          {[
            { ar: 'تواصل معنا عبر واتساب أو الإيميل خلال 14 يوم', en: 'Contact us via WhatsApp or email within 14 days' },
            { ar: 'سنرسل لك مندوب لاستلام المنتج من نفس عنوان التوصيل', en: 'We send a courier to pick up the item from your delivery address' },
            { ar: 'يتم فحص المنتج خلال 48 ساعة من استلامه', en: 'The product is inspected within 48 hours of receipt' },
            { ar: 'يتم استرداد المبلغ بنفس طريقة الدفع خلال 5-7 أيام عمل', en: 'Refund is processed via the same payment method within 5-7 working days' },
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="text-brand-800">{isAr ? s.ar : s.en}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        <div className="text-sm text-amber-900">
          <strong>{isAr ? 'ملاحظة:' : 'Note:'}</strong> {isAr
            ? 'في حالة الاستبدال بمقاس آخر، الشحن من جانبنا مجاني. للإرجاع واسترداد المبلغ، تتحمل أنت رسوم استلام المرتجع (50 ج.م).'
            : 'For exchange to a different size, return shipping is on us. For refund returns, you cover the pickup fee (50 EGP).'}
        </div>
      </div>
    </section>
  );
}
