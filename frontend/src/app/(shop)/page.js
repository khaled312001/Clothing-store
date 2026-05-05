'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Truck, RotateCcw, Shield, Headset, Sparkles, Star, CheckCircle2, Award, ShoppingBag, MoveRight, MoveLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { ProductGrid, ProductGridSkeleton } from '@/components/ProductGrid';
import { SectionHeader } from '@/components/SectionHeader';

export default function HomePage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [data, setData] = useState({ categories: [], featured: [], newArrivals: [], bestsellers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products/featured'),
      api.get('/products/new'),
      api.get('/products/bestsellers'),
    ]).then(([cats, feat, nw, best]) => {
      setData({
        categories: cats.categories,
        featured: feat.products,
        newArrivals: nw.products,
        bestsellers: best.products,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const featureItems = [
    { icon: Truck,    title: t.features.shipping.title,  desc: t.features.shipping.desc, color: 'text-blue-500 bg-blue-50' },
    { icon: RotateCcw, title: t.features.returns.title,  desc: t.features.returns.desc,  color: 'text-emerald-500 bg-emerald-50' },
    { icon: Shield,   title: t.features.payment.title,   desc: t.features.payment.desc,  color: 'text-purple-500 bg-purple-50' },
    { icon: Headset,  title: t.features.support.title,   desc: t.features.support.desc,  color: 'text-amber-500 bg-amber-50' },
  ];

  return (
    <>
      {/* HERO — editorial split layout */}
      <section className="relative overflow-hidden bg-white">
        {/* Background ornaments */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -end-32 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 -start-20 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-50" />
          <svg className="absolute top-10 start-10 w-24 h-24 text-brand-100" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="2" />
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#dots)" />
          </svg>
        </div>

        <div className="container-app relative grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[600px] py-10 lg:py-16">
          {/* LEFT: Content */}
          <div className="lg:col-span-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-xs font-bold mb-6 border border-brand-100">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                {t.hero.eyebrow}
              </div>

              <h1 className="font-extrabold text-brand-950 leading-[0.95] tracking-tight mb-6">
                <span className="block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl">
                  {t.hero.title1}
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-brand-600 mt-2">
                  {t.hero.title2} {t.hero.title3}{' '}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-brand-900 font-black">{t.hero.title4}</span>
                    <span className="absolute -bottom-1 inset-x-0 h-3 bg-accent-300 -z-0 rounded-sm" />
                  </span>
                </span>
              </h1>

              <p className="text-base lg:text-lg text-brand-700 max-w-xl mb-8 leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/category/women" className="btn btn-primary btn-lg group">
                  <ShoppingBag className="w-5 h-5" />
                  {t.hero.cta}
                  <Arrow className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link href="/products?sort=price-asc" className="btn btn-outline btn-lg">
                  {t.hero.cta2}
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md border-t border-gray-100 pt-6">
                {[
                  { num: t.hero.stat1Num, label: t.hero.stat1Label },
                  { num: t.hero.stat2Num, label: t.hero.stat2Label },
                  { num: t.hero.stat3Num, label: t.hero.stat3Label, stars: true },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold text-brand-900 flex items-baseline gap-1">
                      {s.num}
                      {s.stars && <Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Editorial image collage */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="grid grid-cols-12 grid-rows-6 gap-3 h-[500px] lg:h-[620px]">
                {/* Main large image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-7 row-span-6 rounded-3xl overflow-hidden relative shadow-2xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85"
                    alt="Editorial"
                    fill
                    priority
                    sizes="(max-width: 1024px) 60vw, 35vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 text-white">
                    <div className="text-xs font-bold tracking-widest opacity-80 mb-1">EDITORIAL</div>
                    <div className="text-xl font-extrabold">{isAr ? 'مجموعة الربيع' : 'Spring Edit'}</div>
                  </div>
                </motion.div>

                {/* Top right */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-5 row-span-3 rounded-3xl overflow-hidden relative shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=85"
                    alt="Men"
                    fill
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                  <div className="absolute bottom-3 start-3 text-white">
                    <div className="text-[10px] font-bold tracking-widest opacity-80">{isAr ? 'رجالي' : 'MEN'}</div>
                  </div>
                </motion.div>

                {/* Bottom right */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-5 row-span-3 rounded-3xl overflow-hidden relative shadow-xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=85"
                    alt="Kids"
                    fill
                    sizes="(max-width: 1024px) 40vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
                  <div className="absolute bottom-3 start-3 text-white">
                    <div className="text-[10px] font-bold tracking-widest opacity-80">{isAr ? 'أطفالي' : 'KIDS'}</div>
                  </div>
                </motion.div>
              </div>

              {/* Floating award badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}
                className="absolute -top-4 -start-4 bg-white rounded-2xl shadow-2xl p-3 flex items-center gap-2 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-900 leading-tight">{isAr ? 'خصومات تصل إلى' : 'Up to'}</div>
                  <div className="text-lg font-extrabold text-brand-900 leading-tight">{isAr ? '50% خصم' : '50% OFF'}</div>
                </div>
              </motion.div>

              {/* Floating reviews badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -bottom-4 -end-4 bg-brand-950 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-[200px]"
              >
                <div className="flex -space-x-2 rtl:space-x-reverse rtl:-space-x-reverse shrink-0">
                  {['#ef4444','#f59e0b','#10b981'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-950 flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                      {['M','S','K'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <div className="text-[10px] text-brand-200 font-semibold leading-tight">{isAr ? '12,000+ عميل سعيد' : '12,000+ happy clients'}</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scrolling brand marquee */}
        <div className="border-y border-gray-100 bg-gray-50/50 overflow-hidden">
          <div className="flex gap-12 py-4 whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, ri) => (
              <div key={ri} className="flex items-center gap-12 shrink-0">
                {['VOGUE', 'ELLE', 'HARPER\'S BAZAAR', 'GQ', 'COSMOPOLITAN', 'GLAMOUR', 'MARIE CLAIRE', 'VANITY FAIR'].map((b, i) => (
                  <span key={`${ri}-${i}`} className="text-brand-400 font-extrabold text-sm tracking-[0.25em] hover:text-brand-700 transition">
                    {b}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="border-y bg-white">
        <div className="container-app grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
          {featureItems.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-900 text-sm">{title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="container-app py-12 lg:py-16">
        <SectionHeader title={t.sections.shopByCategory} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {(data.categories || []).filter(c => !c.parent_id).slice(0, 3).map((cat, i) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition"
            >
              {cat.image_url && (
                <Image
                  src={cat.image_url}
                  alt={isAr ? cat.name_ar : cat.name_en}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="text-xs uppercase tracking-wider opacity-80 mb-1">
                  {`0${i + 1}`}
                </div>
                <h3 className="text-3xl font-extrabold mb-2">
                  {isAr ? cat.name_ar : cat.name_en}
                </h3>
                <span className="inline-flex items-center gap-2 text-sm font-semibold border-b-2 border-accent-400 pb-0.5">
                  {isAr ? 'استكشف الآن' : 'Shop now'} <Arrow className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-app py-8 lg:py-12">
        <SectionHeader
          title={t.sections.bestsellers}
          subtitle={isAr ? 'الأكثر طلباً من عملائنا' : 'Most loved by our customers'}
          viewAllHref="/products?sort=bestseller"
          viewAllLabel={t.common.viewAll}
        />
        {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={data.bestsellers.slice(0, 8)} />}
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="container-app py-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-700 to-brand-950 p-8 text-white min-h-[220px] flex flex-col justify-center">
            <div className="absolute inset-0 opacity-20">
              <Image src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800" alt="" fill className="object-cover" sizes="50vw" />
            </div>
            <div className="relative">
              <div className="text-accent-300 font-semibold mb-2">{isAr ? 'مجموعة الأطفال' : 'Kids Collection'}</div>
              <h3 className="text-3xl font-extrabold mb-2">{isAr ? 'تشكيلة عودة المدارس' : 'Back-to-School Picks'}</h3>
              <p className="text-brand-200 mb-4 text-sm max-w-xs">{isAr ? 'كل اللي يحتاجه طفلك بأسعار خاصة' : 'Everything your kid needs at special prices'}</p>
              <Link href="/category/kids" className="btn btn-accent btn-md w-fit">{t.hero.cta} <Arrow className="w-4 h-4" /></Link>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent-400 to-accent-600 p-8 text-brand-950 min-h-[220px] flex flex-col justify-center">
            <div className="absolute inset-0 opacity-20">
              <Image src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800" alt="" fill className="object-cover" sizes="50vw" />
            </div>
            <div className="relative">
              <div className="font-semibold mb-2 opacity-80">{isAr ? 'سواريه' : 'Evening Wear'}</div>
              <h3 className="text-3xl font-extrabold mb-2">{isAr ? 'تألقي في كل مناسبة' : 'Shine on Every Occasion'}</h3>
              <p className="opacity-90 mb-4 text-sm max-w-xs">{isAr ? 'فساتين فاخرة تصل إلى 30% خصم' : 'Premium dresses up to 30% OFF'}</p>
              <Link href="/category/women-evening" className="btn bg-brand-900 text-white hover:bg-brand-950 btn-md w-fit">{t.hero.cta} <Arrow className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-app py-8 lg:py-12">
        <SectionHeader
          title={t.sections.featured}
          subtitle={isAr ? 'مختارات اليوم من فريقنا' : "Today's editor picks"}
          viewAllHref="/products?featured=1"
          viewAllLabel={t.common.viewAll}
        />
        {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={data.featured.slice(0, 8)} />}
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-app py-8 lg:py-12">
        <SectionHeader
          title={t.sections.newArrivals}
          subtitle={isAr ? 'وصلت حديثاً إلى متجرنا' : 'Just landed in our store'}
          viewAllHref="/products?isNew=1"
          viewAllLabel={t.common.viewAll}
        />
        {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={data.newArrivals.slice(0, 4)} />}
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-brand-50 py-16 mt-12">
        <div className="container-app">
          <SectionHeader title={t.sections.testimonials} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: isAr ? 'سارة أحمد' : 'Sara Ahmed', text: isAr ? 'أفضل تجربة شراء أونلاين! المنتجات جودتها ممتازة والتوصيل سريع جداً.' : 'Best online shopping experience! Quality is excellent and delivery is super fast.', rating: 5 },
              { name: isAr ? 'محمد علي' : 'Mohamed Ali', text: isAr ? 'القمصان الرجالي خامتها فاخرة وسعرها مناسب جداً. سأشتري دائماً منهم.' : 'Men shirts have premium fabric at great prices. Will always buy from them.', rating: 5 },
              { name: isAr ? 'منى حسن' : 'Mona Hassan', text: isAr ? 'بنتي حبت كل اللي اشتريته من قسم الأطفال. خامات آمنة وألوان جميلة.' : 'My daughter loved everything I bought from kids. Safe fabrics and pretty colors.', rating: 5 },
            ].map((r, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-brand-800 mb-4 leading-relaxed">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-brand-900 text-sm">{r.name}</div>
                    <div className="text-xs text-gray-500">{isAr ? 'عميل موثّق' : 'Verified buyer'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
