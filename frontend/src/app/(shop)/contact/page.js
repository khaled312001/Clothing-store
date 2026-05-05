'use client';

import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { useState } from 'react';

export default function ContactPage() {
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const [sent, setSent] = useState(false);

  return (
    <section className="container-app py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-brand-900 mb-3">{t.nav.contact}</h1>
        <p className="text-gray-600">
          {isAr ? 'فريقنا جاهز للرد على استفساراتك في أي وقت — تواصل معنا بالطريقة الأنسب لك.' : 'Our team is ready to help anytime — choose the way that suits you.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); }} className="card p-6 space-y-4">
          <h2 className="text-xl font-bold text-brand-900 mb-2">{isAr ? 'أرسل لنا رسالة' : 'Send us a message'}</h2>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.name}</label>
            <input required className="input h-11" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{t.auth.email}</label>
            <input required type="email" className="input h-11" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{isAr ? 'الموضوع' : 'Subject'}</label>
            <input required className="input h-11" />
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-800 block mb-1">{isAr ? 'الرسالة' : 'Message'}</label>
            <textarea required rows="5" className="input"></textarea>
          </div>
          {sent && (
            <div className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {isAr ? 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' : 'Message sent! We will get back to you soon.'}
            </div>
          )}
          <button className="btn btn-primary btn-lg w-full">{isAr ? 'إرسال' : 'Send'}</button>
        </form>

        {/* Info */}
        <div className="space-y-4">
          <a href="tel:+201010254819" className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Phone className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-gray-500">{isAr ? 'اتصل بنا' : 'Call us'}</div>
              <div className="font-bold text-brand-900" dir="ltr">+20 101 025 4819</div>
            </div>
          </a>
          <a href="https://wa.me/201010254819" target="_blank" className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-gray-500">WhatsApp</div>
              <div className="font-bold text-brand-900" dir="ltr">+20 101 025 4819</div>
            </div>
          </a>
          <a href="mailto:info@barmagly.tech" className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Mail className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-bold text-brand-900" dir="ltr">info@barmagly.tech</div>
            </div>
          </a>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-gray-500">{isAr ? 'مواعيد العمل' : 'Working hours'}</div>
              <div className="font-bold text-brand-900">{isAr ? 'السبت - الخميس · 9 ص - 9 م' : 'Sat - Thu · 9 AM - 9 PM'}</div>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
            <div>
              <div className="text-xs text-gray-500">{isAr ? 'العنوان' : 'Address'}</div>
              <div className="font-bold text-brand-900">{isAr ? 'جمهورية مصر العربية' : 'Cairo, Egypt'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
