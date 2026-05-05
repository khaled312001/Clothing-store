'use client';

import { Shield } from 'lucide-react';
import { useUI } from '@/lib/store';

export default function PrivacyPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';

  const sections = isAr ? [
    {
      title: 'البيانات التي نجمعها',
      body: 'نقوم بجمع البيانات اللازمة لإتمام طلبك مثل: الاسم، رقم الهاتف، البريد الإلكتروني، عنوان الشحن. كما نحتفظ بسجل مشترياتك وتقييماتك.',
    },
    {
      title: 'كيف نستخدم بياناتك',
      body: 'نستخدم بياناتك فقط لتنفيذ طلبك، التواصل بشأنه، إرسال إشعارات الشحن، وتحسين تجربتك. لا نشاركها مع طرف ثالث إلا إذا كان ذلك ضرورياً لتنفيذ الطلب (مثل شركة الشحن).',
    },
    {
      title: 'أمان بيانات الدفع',
      body: 'لا نحتفظ بأي بيانات بطاقة ائتمانية على خوادمنا. تتم كل عمليات الدفع عبر بوابات آمنة ومعتمدة (Paymob, Fawry) متوافقة مع معيار PCI-DSS و3D Secure.',
    },
    {
      title: 'ملفات تعريف الارتباط (Cookies)',
      body: 'نستخدم ملفات Cookies لحفظ سلتك، تفضيلاتك، وتحسين تجربتك. يمكنك تعطيلها من إعدادات متصفحك في أي وقت.',
    },
    {
      title: 'حقوقك',
      body: 'لك الحق في طلب الاطلاع على بياناتك، تعديلها، أو حذفها نهائياً. تواصل معنا على info@barmagly.tech لأي استفسار.',
    },
    {
      title: 'تحديثات السياسة',
      body: 'قد نحدث هذه السياسة من وقت لآخر. سنعلمك بأي تغيير جوهري عبر بريدك الإلكتروني.',
    },
  ] : [
    { title: 'Data we collect', body: 'We collect data necessary to complete your order: name, phone, email, shipping address. We also keep records of your purchases and reviews.' },
    { title: 'How we use your data', body: 'Your data is used only to process your order, communicate about it, send shipping notifications, and improve your experience. We do not share it with third parties except where necessary (e.g. courier).' },
    { title: 'Payment data security', body: 'We do not store any credit card data on our servers. All payments go through secure certified gateways (Paymob, Fawry) compliant with PCI-DSS and 3D Secure.' },
    { title: 'Cookies', body: 'We use cookies to remember your cart, preferences, and improve your experience. You can disable them from your browser settings anytime.' },
    { title: 'Your rights', body: 'You have the right to request access to your data, edit it, or delete it permanently. Contact info@barmagly.tech for any inquiry.' },
    { title: 'Policy updates', body: 'We may update this policy from time to time. We will notify you by email of any material change.' },
  ];

  return (
    <section className="container-app py-10 max-w-4xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-900 mb-3">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
        <p className="text-gray-600">{isAr ? 'خصوصيتك تهمنا — هذه التزاماتنا تجاه بياناتك' : 'Your privacy matters — here are our commitments to your data'}</p>
      </div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="card p-5">
            <h2 className="font-bold text-brand-900 text-lg mb-2">{s.title}</h2>
            <p className="text-brand-700 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
