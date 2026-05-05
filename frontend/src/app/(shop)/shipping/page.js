'use client';

import { Truck, Clock, MapPin, CreditCard, Package, Phone, Calendar, Wallet, Navigation } from 'lucide-react';
import { useUI } from '@/lib/store';

export default function ShippingPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';

  const zones = [
    { area: isAr ? 'القاهرة الكبرى (القاهرة + الجيزة)' : 'Greater Cairo (Cairo + Giza)', fee: 50, time: isAr ? '1-2 أيام عمل' : '1-2 working days' },
    { area: isAr ? 'الإسكندرية' : 'Alexandria',                                                fee: 60, time: isAr ? '2-3 أيام عمل' : '2-3 working days' },
    { area: isAr ? 'الدلتا (الدقهلية، الشرقية، المنوفية، القليوبية، البحيرة، كفر الشيخ)' : 'Delta (Dakahlia, Sharqia, Monufia, Qalyubia, Beheira, Kafr El Sheikh)', fee: 70, time: isAr ? '2-4 أيام عمل' : '2-4 working days' },
    { area: isAr ? 'الصعيد (الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان)' : 'Upper Egypt', fee: 90, time: isAr ? '3-5 أيام عمل' : '3-5 working days' },
    { area: isAr ? 'القناة (بورسعيد، الإسماعيلية، السويس، دمياط)' : 'Canal (Port Said, Ismailia, Suez, Damietta)', fee: 75, time: isAr ? '2-4 أيام عمل' : '2-4 working days' },
    { area: isAr ? 'سيناء، الوادي الجديد، البحر الأحمر، مطروح' : 'Sinai, New Valley, Red Sea, Matrouh', fee: 120, time: isAr ? '4-7 أيام عمل' : '4-7 working days' },
  ];

  return (
    <section className="container-app py-10 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-900 mb-3">{isAr ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}</h1>
        <p className="text-gray-600">{isAr ? 'نوصل طلبك بأسرع وقت ممكن لكل أنحاء جمهورية مصر العربية' : 'We deliver your order to anywhere in Egypt as fast as possible'}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5 text-center">
          <Clock className="w-8 h-8 text-brand-600 mx-auto mb-2" />
          <h3 className="font-bold text-brand-900 mb-1">{isAr ? 'سرعة التجهيز' : 'Processing speed'}</h3>
          <p className="text-sm text-gray-600">{isAr ? 'يتم تجهيز طلبك خلال 24 ساعة من تأكيده' : 'Your order is processed within 24 hours of confirmation'}</p>
        </div>
        <div className="card p-5 text-center">
          <Package className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-bold text-brand-900 mb-1">{isAr ? 'تغليف آمن' : 'Safe packaging'}</h3>
          <p className="text-sm text-gray-600">{isAr ? 'تغليف احترافي يحفظ منتجاتك بحالة ممتازة' : 'Premium packaging that protects your products'}</p>
        </div>
        <div className="card p-5 text-center">
          <CreditCard className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <h3 className="font-bold text-brand-900 mb-1">{isAr ? 'شحن مجاني' : 'Free shipping'}</h3>
          <p className="text-sm text-gray-600">{isAr ? 'لكل الطلبات فوق 1500 جنيه مصري' : 'For all orders above 1500 EGP'}</p>
        </div>
      </div>

      <div className="card overflow-hidden mb-8">
        <div className="bg-brand-900 text-white p-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <h2 className="font-bold">{isAr ? 'أسعار ومدد الشحن حسب المنطقة' : 'Shipping fees and times by region'}</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-brand-700 text-xs uppercase">
            <tr>
              <th className="text-start px-4 py-3">{isAr ? 'المنطقة' : 'Region'}</th>
              <th className="text-start px-3 py-3">{isAr ? 'الرسوم' : 'Fee'}</th>
              <th className="text-start px-3 py-3">{isAr ? 'مدة التوصيل' : 'Delivery time'}</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{z.area}</td>
                <td className="px-3 py-3"><strong>{z.fee} {isAr ? 'ج.م' : 'EGP'}</strong></td>
                <td className="px-3 py-3 text-gray-600">{z.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-brand-900 mb-4">{isAr ? 'ملاحظات هامة' : 'Important notes'}</h2>
        <ul className="space-y-3">
          {[
            { Icon: Truck, text: isAr ? 'الشحن مجاني تماماً لكل الطلبات التي تزيد قيمتها عن 1,500 جنيه.' : 'Shipping is completely free for all orders over 1,500 EGP.' },
            { Icon: Phone, text: isAr ? 'يتم تأكيد الطلب عبر مكالمة هاتفية قبل الشحن.' : 'Orders are confirmed via phone call before shipping.' },
            { Icon: Calendar, text: isAr ? 'مدة التوصيل تبدأ من اليوم التالي لتأكيد الطلب.' : 'Delivery time starts from the day after order confirmation.' },
            { Icon: Wallet, text: isAr ? 'الدفع عند الاستلام متاح في جميع المحافظات.' : 'Cash on Delivery is available in all governorates.' },
            { Icon: Navigation, text: isAr ? 'يمكنك تتبع طلبك من حسابك على الموقع بمجرد شحنه.' : 'You can track your order from your account once shipped.' },
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-brand-800">
              <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <item.Icon className="w-4 h-4" />
              </span>
              <span className="pt-1">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
