'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Truck, MapPin, Check, Loader2, Banknote, Smartphone, Wallet, Landmark, AlertTriangle } from 'lucide-react';
import { useAuth, useCart, useUI } from '@/lib/store';
import { getDictionary } from '@/i18n/dictionaries';
import { api } from '@/lib/api';
import { cn, formatPrice } from '@/lib/utils';

const GOVERNORATES = [
  'القاهرة','الجيزة','الإسكندرية','الدقهلية','الشرقية','المنوفية','القليوبية','البحيرة','كفر الشيخ',
  'الغربية','الفيوم','بني سويف','المنيا','أسيوط','سوهاج','قنا','الأقصر','أسوان','البحر الأحمر',
  'مطروح','الوادي الجديد','شمال سيناء','جنوب سيناء','بورسعيد','دمياط','الإسماعيلية','السويس',
];

const PAYMENT_METHODS = [
  { id: 'cod',           Icon: Banknote,   color: 'text-emerald-600 bg-emerald-50', enabled: true },
  { id: 'card',          Icon: CreditCard, color: 'text-blue-600 bg-blue-50',       enabled: true },
  { id: 'fawry',         Icon: Wallet,     color: 'text-orange-600 bg-orange-50',   enabled: true },
  { id: 'paymob',        Icon: Landmark,   color: 'text-purple-600 bg-purple-50',   enabled: true },
  { id: 'vodafone_cash', Icon: Smartphone, color: 'text-red-600 bg-red-50',         enabled: true },
  { id: 'instapay',      Icon: Smartphone, color: 'text-indigo-600 bg-indigo-50',   enabled: true },
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
            <div className="grid sm:grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(m => (
                <label
                  key={m.id}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition',
                    form.payment_method === m.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={form.payment_method === m.id}
                    onChange={(e) => update('payment_method', e.target.value)}
                    className="text-brand-600"
                  />
                  <span className={cn('w-9 h-9 rounded-lg flex items-center justify-center', m.color)}>
                    <m.Icon className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-sm">{t.checkout.methods[m.id]}</span>
                  {form.payment_method === m.id && <Check className="w-5 h-5 text-brand-600 ms-auto" />}
                </label>
              ))}
            </div>
            {form.payment_method !== 'cod' && (
              <div className="mt-4 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>{isAr
                  ? 'في الإصدار التجريبي، يتم اعتبار الدفع الإلكتروني تم بنجاح تلقائياً. في الإنتاج يتم الربط بـ Paymob/Fawry فعلياً.'
                  : 'In demo mode, electronic payments are auto-marked as paid. In production this connects to real Paymob/Fawry gateways.'}</p>
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
