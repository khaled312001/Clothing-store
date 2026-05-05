'use client';

import Link from 'next/link';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { Facebook, Instagram, Youtube, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { locale } = useUI();
  const t = getDictionary(locale);

  return (
    <footer className="bg-brand-950 text-brand-100 mt-20">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-900 border-b border-brand-700">
        <div className="container-app py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{t.sections.newsletter}</h3>
            <p className="text-brand-200 text-sm">{t.sections.newsletterDesc}</p>
          </div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert(locale === 'ar' ? 'شكراً لاشتراكك!' : 'Thanks for subscribing!'); }}>
            <input
              type="email"
              required
              placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
              className="input flex-1 h-12 rounded-2xl text-brand-900"
            />
            <button className="btn btn-accent btn-md h-12 px-6 rounded-2xl whitespace-nowrap">
              {locale === 'ar' ? 'اشترك' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="container-app py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-mark.svg" alt="AURA" className="w-12 h-12" />
            <div>
              <div className="font-extrabold text-white text-lg leading-none tracking-tight">{t.site.name}</div>
              <div className="text-xs text-brand-300 mt-1 tracking-[0.18em] font-bold">AURA · FASHION HOUSE</div>
            </div>
          </div>
          <p className="text-sm text-brand-200 leading-relaxed">
            {locale === 'ar'
              ? 'متجرك الإلكتروني المتكامل لكل أزياء العائلة. أطفالي · حريمي · رجالي بأفضل الخامات وأحدث الموضة.'
              : 'Your complete fashion destination for the whole family — Kids, Women, Men. Premium fabrics and latest trends.'}
          </p>
          <div className="flex gap-2 mt-4">
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-800 hover:bg-accent-400 hover:text-brand-950 flex items-center justify-center transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-800 hover:bg-accent-400 hover:text-brand-950 flex items-center justify-center transition"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-800 hover:bg-accent-400 hover:text-brand-950 flex items-center justify-center transition"><Youtube className="w-4 h-4" /></a>
            <a href="https://wa.me/201010254819" className="w-9 h-9 rounded-lg bg-brand-800 hover:bg-accent-400 hover:text-brand-950 flex items-center justify-center transition"><MessageCircle className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-4">{t.footer.quickLinks}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/category/kids" className="hover:text-accent-300 transition">{t.nav.kids}</Link></li>
            <li><Link href="/category/women" className="hover:text-accent-300 transition">{t.nav.women}</Link></li>
            <li><Link href="/category/men" className="hover:text-accent-300 transition">{t.nav.men}</Link></li>
            <li><Link href="/products?sort=bestseller" className="hover:text-accent-300 transition">{t.nav.bestsellers}</Link></li>
            <li><Link href="/products?isNew=1" className="hover:text-accent-300 transition">{t.nav.new}</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-bold text-white mb-4">{t.footer.help}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-accent-300 transition">{t.nav.faq}</Link></li>
            <li><Link href="/contact" className="hover:text-accent-300 transition">{t.nav.contact}</Link></li>
            <li><Link href="/shipping" className="hover:text-accent-300 transition">{locale === 'ar' ? 'سياسة الشحن' : 'Shipping Policy'}</Link></li>
            <li><Link href="/returns" className="hover:text-accent-300 transition">{locale === 'ar' ? 'الإرجاع والاستبدال' : 'Returns & Exchange'}</Link></li>
            <li><Link href="/sizing" className="hover:text-accent-300 transition">{locale === 'ar' ? 'دليل المقاسات' : 'Size Guide'}</Link></li>
            <li><Link href="/privacy" className="hover:text-accent-300 transition">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-4">{t.footer.contact}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-accent-400 shrink-0" />
              <span>{locale === 'ar' ? 'جمهورية مصر العربية' : 'Egypt'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent-400 shrink-0" />
              <a href="tel:+201010254819" className="hover:text-accent-300 transition" dir="ltr">+20 101 025 4819</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent-400 shrink-0" />
              <a href="mailto:info@barmagly.tech" className="hover:text-accent-300 transition" dir="ltr">info@barmagly.tech</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-accent-400 shrink-0" />
              <a href="https://wa.me/201010254819" className="hover:text-accent-300 transition" dir="ltr">WhatsApp · +20 101 025 4819</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Payments */}
      <div className="border-t border-brand-800">
        <div className="container-app py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-brand-300">{t.footer.payments}</div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { src: '/payments/visa.svg',          alt: 'Visa' },
              { src: '/payments/mastercard.svg',    alt: 'Mastercard' },
              { src: '/payments/meeza.svg',         alt: 'Meeza' },
              { src: '/payments/fawry.svg',         alt: 'Fawry' },
              { src: '/payments/paymob.svg',        alt: 'Paymob' },
              { src: '/payments/instapay.svg',      alt: 'InstaPay' },
              { src: '/payments/vodafone-cash.svg', alt: 'Vodafone Cash' },
              { src: '/payments/cod.svg',           alt: 'COD' },
            ].map((p) => (
              <div key={p.alt} className="bg-white rounded-lg p-1.5 h-9 flex items-center" title={p.alt}>
                <img src={p.src} alt={p.alt} className="h-6 w-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom — Developed by Barmagly */}
      <div className="border-t border-brand-800 bg-brand-950">
        <div className="container-app py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <div className="text-brand-300">
            © 2026 {t.site.name} · {t.footer.rights}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-300">{t.footer.developedBy}</span>
            <a
              href="https://barmagly.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent-400 hover:text-accent-300 transition flex items-center gap-1.5"
            >
              <img src="/logo-mark.svg" alt="" className="w-5 h-5" />
              شركة برمجلي · Barmagly
            </a>
            <span className="text-brand-500">·</span>
            <a href="https://barmagly.tech" target="_blank" rel="noopener noreferrer" className="text-brand-300 hover:text-accent-300 transition" dir="ltr">
              barmagly.tech
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
