'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, Truck, Heart, Users, Shield, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { useUI } from '@/lib/store';

export default function AboutPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const values = [
    { icon: Award,    title: isAr ? 'جودة عالية' : 'Premium quality', desc: isAr ? 'نختار أفضل الخامات والماركات لعملائنا' : 'We pick the best fabrics and brands for our customers' },
    { icon: Heart,    title: isAr ? 'حب العميل' : 'Customer love',    desc: isAr ? 'رضاك أولويتنا الأولى' : 'Your satisfaction is our top priority' },
    { icon: Truck,    title: isAr ? 'سرعة التوصيل' : 'Fast delivery', desc: isAr ? 'توصيل سريع لكل أنحاء مصر' : 'Fast delivery across all of Egypt' },
    { icon: Shield,   title: isAr ? 'تسوق آمن' : 'Safe shopping',     desc: isAr ? 'بوابات دفع آمنة وحماية كاملة' : 'Secure payment gateways and full protection' },
  ];

  return (
    <>
      <section className="relative h-72 bg-gradient-to-br from-brand-900 to-brand-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600" alt="" fill className="object-cover" />
        </div>
        <div className="container-app relative h-full flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 bg-accent-400 text-brand-950 px-3 py-1 rounded-full text-xs font-bold w-fit mb-3">
            <Sparkles className="w-3 h-3" />{isAr ? 'منذ 2026' : 'Since 2026'}
          </span>
          <h1 className="text-5xl font-extrabold mb-2">{isAr ? 'عن AURA' : 'About AURA'}</h1>
          <p className="text-brand-100 text-lg">{isAr ? 'وجهتك الأولى للأزياء العصرية في مصر' : 'Your first destination for modern fashion in Egypt'}</p>
        </div>
      </section>

      <section className="container-app py-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-900 mb-4">{isAr ? 'قصتنا' : 'Our story'}</h2>
          <p className="text-brand-700 leading-relaxed mb-4">
            {isAr
              ? 'انطلق متجر AURA للأزياء بفكرة بسيطة: تقديم تجربة تسوق إلكترونية عصرية للعائلة العربية بأسعار مناسبة وجودة لا تنافَس. نحن نؤمن أن الموضة حق للجميع، ولذلك جمعنا تشكيلة واسعة تخدم كل أفراد العائلة.'
              : 'AURA Fashion was launched with a simple idea: deliver a modern online shopping experience to families at fair prices and uncompromised quality. We believe fashion is for everyone — so we curated a wide range that serves the whole family.'}
          </p>
          <p className="text-brand-700 leading-relaxed">
            {isAr
              ? 'اليوم، نخدم آلاف العملاء في كل المحافظات المصرية، ونعمل دائماً على توسيع تشكيلتنا وتحسين تجربتنا. هدفنا أن نكون الخيار الأول لكل من يبحث عن أزياء عصرية بجودة عالية.'
              : 'Today we serve thousands of customers across every Egyptian governorate, constantly expanding our range and improving the experience. Our goal is to be the first choice for anyone seeking modern fashion at premium quality.'}
          </p>
          <Link href="/" className="btn btn-primary btn-lg mt-6">{isAr ? 'تسوّق الآن' : 'Shop now'}<Arrow className="w-5 h-5" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden relative">
            <Image src="https://images.unsplash.com/photo-1485518882345-15568b007407?w=600" alt="" fill className="object-cover" sizes="40vw" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden relative">
            <Image src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600" alt="" fill className="object-cover" sizes="40vw" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden relative">
            <Image src="https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600" alt="" fill className="object-cover" sizes="40vw" />
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden relative">
            <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600" alt="" fill className="object-cover" sizes="40vw" />
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-16">
        <div className="container-app">
          <h2 className="text-3xl font-extrabold text-brand-900 text-center mb-10">{isAr ? 'قيمنا' : 'Our values'}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center hover:shadow-card-hover transition">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 mx-auto mb-3 flex items-center justify-center">
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-brand-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app py-16 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        {[
          { num: '12,000+', label: isAr ? 'عميل سعيد' : 'Happy customers' },
          { num: '500+',    label: isAr ? 'منتج متنوع' : 'Diverse products' },
          { num: '27',      label: isAr ? 'محافظة نخدمها' : 'Governorates served' },
          { num: '4.9★',    label: isAr ? 'متوسط التقييم' : 'Average rating' },
        ].map((s) => (
          <div key={s.num} className="card p-6">
            <div className="text-4xl font-extrabold text-brand-700 mb-1">{s.num}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </section>
    </>
  );
}
