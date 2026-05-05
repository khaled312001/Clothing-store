'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { CreditCard, Truck, MapPin, Check, Loader2, AlertTriangle, Upload, Copy, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';
import { useAuth, useCart, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { api } from '@/lib/api';
import { cn, formatPrice } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const GOVERNORATES = [
  'القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية','المنوفية','القليوبية','البحيرة','كفر الشيخ',
  'الغربية','الفيوم','بني سويف','المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان','البحر الأحمر',
  'مطروح','الوادي الجديد','شمال سيناء','جنوب سيناء','بورسعيد','دمياط','الإسماعيلية','السويس',
];

const PAYMENT_METHODS = [
  { id: 'cod',           logo: '/payments/cod.svg',           bg: 'bg-emerald-50',  ring: 'ring-emerald-200' },
  { id: 'vodafone_cash', logo: '/payments/vodafone-cash.svg', bg: 'bg-red-50',      ring: 'ring-red-200' },
  { id: 'instapay',      logo: '/payments/instapay.svg',      bg: 'bg-orange-50',   ring: 'ring-orange-200' },
  { id: 'fawry',         logo: '/payments/fawry.svg',         bg: 'bg-amber-50',    ring: 'ring-amber-200' },
  { id: 'paymob',        logo: '/payments/paymob.svg',        bg: 'bg-purple-50',   ring: 'ring-purple-200' },
  { id: 'card',          logo: '/payments/visa.svg',          bg: 'bg-blue-50',     ring: 'ring-blue-200', logo2: '/payments/mastercard.svg' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useUI();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const { user, token } = useAuth();
  const cart = useCart();

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    governorate: GOVERNORATES[0],
    city: '',
    street: '',
    building: '',
    apartment: '',
    notes: '',
    payment_method: 'cod',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({});
  const [paymentProof, setPaymentProof] = useState({ url: '', uploading: false });
  const [paymentRef, setPaymentRef] = useState('');
  const [copied, setCopied] = useState('');
  const fileRef = useRef(null);

  // Load payment account settings (vodafone number, instapay handle, bank...)
  useEffect(() => {
    api.get('/settings').then(d => setSettings(d.settings || {})).catch(() => {});
  }, []);

  const requiresProof = ['fawry','paymob','vodafone_cash','instapay','card'].includes(form.payment_method);

  const uploadProof = async (file) => {
    if (!file) return;
    setPaymentProof(p => ({ ...p, uploading: true }));
    try {
      const fd = new FormData();
      fd.append('files', file);
      const tk = typeof window !== 'undefined' ? localStorage.getItem('bmg_token') : null;
      const res = await fetch(`${API_BASE}/uploads`, {
        method: 'POST',
        headers: tk ? { Authorization: `Bearer ${tk}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPaymentProof({ url: data.urls?.[0] || '', uploading: false });
    } catch (e) {
      alert(e.message);
      setPaymentProof(p => ({ ...p, uploading: false }));
    }
  };

  const copyText = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(''), 1500);
    } catch {}
  };

  // Pre-fill from user
  useEffect(() => {
    if (user) setForm(f => ({ ...f, full_name: user.name || '', phone: user.phone || '' }));
  }, [user]);

  // Redirect if not logged in (need auth for checkout)
  useEffect(() => {
    if (!token) router.push('/auth/login?next=/checkout');
  }, [token, router]);

  // Fetch server cart
  useEffect(() => {
    if (token) cart.fetchServer();
    // eslint-disable-next-line
  }, [token]);

  const items = cart.serverItems || [];
  const subtotal = cart.subtotal || 0;
  const discount = cart.coupon?.discount || 0;
  const FREE_THRESHOLD = 1500;
  const shipping = subtotal - discount >= FREE_THRESHOLD ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shipping);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) { setError(isAr ? 'سلتك فارغة' : 'Cart empty'); return; }
    if (requiresProof && !paymentProof.url) {
      setError(isAr ? 'يجب رفع صورة إيصال التحويل قبل تأكيد الطلب' : 'You must upload the transfer screenshot before confirming the order');
      return;
    }
    setLoading(true);
    try {
      const { order } = await api.post('/orders', {
        ...form,
        coupon_code: cart.coupon?.code,
        shipping_full_name: form.full_name,
        shipping_phone: form.phone,
        shipping_governorate: form.governorate,
        shipping_city: form.city,
        shipping_street: form.street,
        shipping_building: form.building,
        shipping_apartment: form.apartment,
        shipping_notes: form.notes,
        payment_proof_url: paymentProof.url || null,
        payment_reference: paymentRef || null,
      });
      cart.setCoupon(null);
      cart.fetchServer();
      router.push(`/order/success?id=${order.id}&number=${order.order_number}`);
    } catch (e) {
      setError(e.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <section className="container-app py-8">
      <h1 className="text-3xl font-bold text-brand-900 mb-6">{t.checkout.title}</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          {/* Shipping */}
          <div className="card p-6">
            <h2 className="font-bold text-brand-900 text-lg mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-brand-600" />{t.checkout.shipping}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.fullName} *</label>
                <input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="input h-11" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.phone} *</label>
                <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input h-11" placeholder="+201xxxxxxxxx" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.governorate} *</label>
                <select required value={form.governorate} onChange={(e) => update('governorate', e.target.value)} className="input h-11">
                  {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.city} *</label>
                <input required value={form.city} onChange={(e) => update('city', e.target.value)} className="input h-11" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.street} *</label>
                <input required value={form.street} onChange={(e) => update('street', e.target.value)} className="input h-11" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.building}</label>
                <input value={form.building} onChange={(e) => update('building', e.target.value)} className="input h-11" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.apartment}</label>
                <input value={form.apartment} onChange={(e) => update('apartment', e.target.value)} className="input h-11" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-brand-800 block mb-1">{t.checkout.notes}</label>
                <textarea rows="2" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="input" />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-bold text-brand-900 text-lg mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-600" />{t.checkout.payment}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map(m => {
                const active = form.payment_method === m.id;
                return (
                  <label
                    key={m.id}
                    className={cn(
                      'relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition group',
                      active ? `border-brand-700 ${m.bg} ring-4 ${m.ring}` : 'border-gray-200 hover:border-brand-400 bg-white'
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={active}
                      onChange={(e) => { update('payment_method', e.target.value); setPaymentProof({ url: '', uploading: false }); setPaymentRef(''); }}
                      className="absolute top-2 end-2 text-brand-600 w-4 h-4"
                    />
                    <div className="h-10 flex items-center justify-center gap-1.5">
                      <img src={m.logo} alt={m.id} className="h-9" />
                      {m.logo2 && <img src={m.logo2} alt="" className="h-9" />}
                    </div>
                    <span className="text-xs font-bold text-brand-900 text-center">{t.checkout.methods[m.id]}</span>
                    {active && (
                      <span className="absolute top-2 start-2 bg-brand-700 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Transfer instructions panel — appears for electronic methods */}
            {requiresProof && (
              <div className="mt-5 space-y-4 animate-fade-in">
                <TransferInstructions method={form.payment_method} settings={settings} total={total} isAr={isAr} copied={copied} onCopy={copyText} />

                {/* Reference number input */}
                <div>
                  <label className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1.5">
                    {isAr ? 'رقم العملية / المرجع (اختياري)' : 'Transaction reference (optional)'}
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder={isAr ? 'مثال: TX12345 أو آخر 6 أرقام' : 'e.g. TX12345 or last 6 digits'}
                    className="input h-11 font-mono text-sm"
                  />
                </div>

                {/* Screenshot upload — REQUIRED */}
                <div>
                  <label className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1.5">
                    {isAr ? '📸 صورة إيصال التحويل' : '📸 Transfer screenshot'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => uploadProof(e.target.files?.[0])}
                  />
                  {paymentProof.url ? (
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-300 bg-emerald-50">
                      <img src={paymentProof.url} alt="Payment proof" className="w-full max-h-64 object-contain bg-white" />
                      <div className="absolute top-2 end-2 flex gap-2">
                        <button type="button" onClick={() => setPaymentProof({ url: '', uploading: false })}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 start-2 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAr ? 'تم رفع الإيصال' : 'Receipt uploaded'}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={paymentProof.uploading}
                      className="w-full border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-50 rounded-2xl p-6 flex flex-col items-center gap-2 transition group"
                    >
                      {paymentProof.uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                          <span className="text-sm font-bold text-brand-700">{isAr ? 'جاري الرفع…' : 'Uploading…'}</span>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-brand-100 group-hover:bg-brand-200 flex items-center justify-center transition">
                            <Upload className="w-6 h-6 text-brand-700" />
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-brand-900 text-sm">{isAr ? 'اضغط لرفع صورة الإيصال' : 'Click to upload screenshot'}</div>
                            <div className="text-xs text-gray-500 mt-1">{isAr ? 'JPG / PNG · حتى 8 ميجا' : 'JPG / PNG · up to 8MB'}</div>
                          </div>
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {isAr
                      ? 'بعد التحويل، ارفع لقطة شاشة من تطبيقك. سيقوم فريق الإدارة بمراجعتها وتأكيد طلبك خلال ساعات قليلة.'
                      : 'After transfer, upload a screenshot from your app. Our team will review and confirm within hours.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="card p-6 h-fit lg:sticky lg:top-44 space-y-4">
          <h2 className="font-bold text-brand-900 text-lg pb-3 border-b">{t.checkout.review}</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map(it => (
              <div key={it.id} className="flex gap-3 text-sm">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                  {it.image && <Image src={it.image} alt="" fill sizes="60px" className="object-cover" />}
                  <span className="absolute -top-1 -end-1 bg-brand-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{it.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-brand-900 line-clamp-1">{isAr ? it.name_ar : it.name_en}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{it.size} · {isAr ? it.color_name_ar : it.color_name_en}</div>
                </div>
                <div className="font-bold text-sm whitespace-nowrap">{formatPrice(Number(it.price) * it.quantity, locale)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm pt-3 border-t">
            <div className="flex justify-between"><span className="text-gray-600">{t.cart.subtotal}</span><strong>{formatPrice(subtotal, locale)}</strong></div>
            {discount > 0 && <div className="flex justify-between text-emerald-600"><span>{t.cart.discount}</span><strong>-{formatPrice(discount, locale)}</strong></div>}
            <div className="flex justify-between"><span className="text-gray-600">{t.cart.shipping}</span>
              <strong>{shipping === 0 ? <span className="text-emerald-600">{t.cart.freeShipping}</span> : formatPrice(shipping, locale)}</strong>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t">
            <span className="font-bold text-brand-900">{t.cart.total}</span>
            <span className="text-2xl font-extrabold text-brand-900">{formatPrice(total, locale)}</span>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}

          <button type="submit" disabled={loading || items.length === 0} className="btn btn-primary btn-lg w-full">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Truck className="w-5 h-5" />{t.checkout.placeOrder}</>}
          </button>

          <Link href="/cart" className="btn btn-ghost btn-md w-full text-sm">{isAr ? 'العودة للسلة' : 'Back to cart'}</Link>
        </aside>
      </form>
    </section>
  );
}

// ============================================================
// Transfer instructions per payment method
// ============================================================
function CopyRow({ label, value, keyName, copied, onCopy, big = false }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-3">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</div>
        <div className={cn('font-mono font-bold text-brand-900 truncate', big ? 'text-base' : 'text-sm')} dir="ltr">{value}</div>
      </div>
      <button
        type="button"
        onClick={() => onCopy(value, keyName)}
        className={cn('p-2 rounded-lg transition shrink-0', copied === keyName ? 'bg-emerald-500 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100')}
        title="Copy"
      >
        {copied === keyName ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

function TransferInstructions({ method, settings, total, isAr, copied, onCopy }) {
  const totalStr = String(Math.round(Number(total)));

  const config = {
    vodafone_cash: {
      logo: '/payments/vodafone-cash.svg',
      title_ar: 'تعليمات الدفع بفودافون كاش',
      title_en: 'Vodafone Cash transfer instructions',
      steps_ar: [
        'افتح تطبيق فودافون كاش وادخل القائمة الرئيسية',
        'اختر "تحويل أموال" → "إلى محفظة فودافون كاش أخرى"',
        'أدخل الرقم بالأسفل والمبلغ بالظبط',
        'احفظ لقطة شاشة من نتيجة التحويل',
        'ارفع الصورة هنا تحت',
      ],
      steps_en: [
        'Open Vodafone Cash app and go to main menu',
        'Choose "Send Money" → "To another Vodafone Cash"',
        'Enter the wallet number below with the exact amount',
        'Take a screenshot of the success page',
        'Upload it below',
      ],
      rows: [
        { label: isAr ? 'رقم المحفظة' : 'Wallet number', value: settings.pay_vodafone_number || '01010254819', key: 'vc-num', big: true },
        { label: isAr ? 'الاسم' : 'Holder', value: settings.pay_vodafone_name || 'AURA Fashion', key: 'vc-name' },
        { label: isAr ? 'المبلغ' : 'Amount', value: `${totalStr} EGP`, key: 'vc-amt', big: true },
      ],
    },
    instapay: {
      logo: '/payments/instapay.svg',
      title_ar: 'تعليمات الدفع بإنستا باي',
      title_en: 'InstaPay transfer instructions',
      steps_ar: [
        'افتح تطبيق البنك أو InstaPay',
        'اختر "تحويل" → "InstaPay"',
        'أدخل المعرّف بالأسفل والمبلغ بالظبط',
        'احفظ لقطة شاشة من تأكيد التحويل',
        'ارفع الصورة هنا تحت',
      ],
      steps_en: [
        'Open your bank app or InstaPay',
        'Choose "Transfer" → "InstaPay"',
        'Enter the handle below with the exact amount',
        'Take a screenshot of the confirmation',
        'Upload it below',
      ],
      rows: [
        { label: isAr ? 'معرّف InstaPay' : 'InstaPay handle', value: settings.pay_instapay_handle || 'aura@instapay', key: 'ip-h', big: true },
        { label: isAr ? 'الاسم' : 'Holder', value: settings.pay_instapay_name || 'AURA Fashion Store', key: 'ip-n' },
        { label: isAr ? 'المبلغ' : 'Amount', value: `${totalStr} EGP`, key: 'ip-a', big: true },
      ],
    },
    fawry: {
      logo: '/payments/fawry.svg',
      title_ar: 'تعليمات الدفع بفوري',
      title_en: 'Fawry payment instructions',
      steps_ar: [
        'اذهب لأقرب منفذ فوري بلس أو افتح تطبيق MyFawry',
        'اختر "خدمات الدفع" → "تجارة إلكترونية"',
        'أدخل كود التاجر بالأسفل والمبلغ',
        'احتفظ بالإيصال وارفع صورته هنا',
      ],
      steps_en: [
        'Go to nearest Fawry+ outlet or open MyFawry app',
        'Choose "Payment services" → "E-commerce"',
        'Enter the merchant code below and the amount',
        'Keep the receipt and upload its photo here',
      ],
      rows: [
        { label: isAr ? 'كود التاجر' : 'Merchant code', value: settings.pay_fawry_code || '999888', key: 'fw-c', big: true },
        { label: isAr ? 'المبلغ' : 'Amount', value: `${totalStr} EGP`, key: 'fw-a', big: true },
      ],
    },
    paymob: {
      logo: '/payments/paymob.svg',
      title_ar: 'الدفع عبر باي موب',
      title_en: 'Paymob payment',
      steps_ar: [
        'اضغط الرابط بالأسفل لفتح بوابة باي موب الآمنة',
        'أدخل بيانات بطاقتك أو محفظتك',
        'بعد إتمام الدفع، احفظ لقطة شاشة من التأكيد',
        'ارفع الصورة هنا',
      ],
      steps_en: [
        'Click the link below to open Paymob secure gateway',
        'Enter your card or wallet details',
        'After successful payment, screenshot the confirmation',
        'Upload it here',
      ],
      rows: [
        { label: isAr ? 'رابط الدفع الآمن' : 'Secure payment link', value: settings.pay_paymob_link || 'https://accept.paymobsolutions.com/...', key: 'pm-l' },
        { label: isAr ? 'المبلغ' : 'Amount', value: `${totalStr} EGP`, key: 'pm-a', big: true },
      ],
    },
    card: {
      logo: '/payments/visa.svg', logo2: '/payments/mastercard.svg',
      title_ar: 'الدفع بالبطاقة (تحويل بنكي)',
      title_en: 'Card / Bank transfer',
      steps_ar: [
        'حوّل المبلغ على الحساب البنكي بالأسفل',
        'استخدم رقم الطلب كمرجع للتحويل',
        'احتفظ بإيصال التحويل من البنك',
        'ارفع صورة الإيصال هنا',
      ],
      steps_en: [
        'Transfer the amount to the bank account below',
        'Use the order number as transfer reference',
        'Keep the bank transfer receipt',
        'Upload the receipt photo here',
      ],
      rows: [
        { label: isAr ? 'البنك' : 'Bank', value: settings.pay_bank_name || 'CIB Bank', key: 'bk-n' },
        { label: isAr ? 'صاحب الحساب' : 'Account holder', value: settings.pay_bank_holder || 'AURA Fashion House', key: 'bk-h' },
        { label: isAr ? 'رقم الحساب' : 'Account number', value: settings.pay_bank_account || '100025456789', key: 'bk-a', big: true },
        { label: 'IBAN', value: settings.pay_bank_iban || 'EG380010000100002545678901', key: 'bk-i' },
        { label: isAr ? 'المبلغ' : 'Amount', value: `${totalStr} EGP`, key: 'bk-amt', big: true },
      ],
    },
  };

  const c = config[method];
  if (!c) return null;

  return (
    <div className="rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-white overflow-hidden">
      <div className="bg-brand-900 text-white p-4 flex items-center gap-3">
        <div className="bg-white rounded-lg p-2 flex items-center gap-1">
          <img src={c.logo} alt="" className="h-7" />
          {c.logo2 && <img src={c.logo2} alt="" className="h-7" />}
        </div>
        <div>
          <h3 className="font-extrabold text-base">{isAr ? c.title_ar : c.title_en}</h3>
          <p className="text-xs text-brand-200">{isAr ? 'اتبع الخطوات بالترتيب' : 'Follow the steps in order'}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <ol className="space-y-2">
          {(isAr ? c.steps_ar : c.steps_en).map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-brand-800">
              <span className="w-6 h-6 rounded-full bg-brand-700 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>

        <div className="space-y-2 pt-2 border-t border-brand-100">
          {c.rows.map((r) => <CopyRow key={r.key} {...r} keyName={r.key} copied={copied} onCopy={onCopy} />)}
        </div>
      </div>
    </div>
  );
}
