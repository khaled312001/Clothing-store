'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, Plus, Minus, Trash2, ScanBarcode, Banknote, CreditCard, Smartphone, Receipt, X, Loader2, Tag, User } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatPrice } from '@/lib/utils';

const PAY_METHODS = [
  { id: 'cash',     icon: Banknote,   label_ar: 'كاش',         label_en: 'Cash' },
  { id: 'pos_card', icon: CreditCard, label_ar: 'بطاقة (POS)', label_en: 'Card (POS)' },
  { id: 'instapay', icon: Smartphone, label_ar: 'إنستا باي',   label_en: 'InstaPay' },
];

export default function POSPage() {
  const { locale } = useUI();
  const isAr = locale === 'ar';

  const [q, setQ] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);  // items: { variant_id, product_id, sku, name, size, color_ar, color_en, color_hex, price, image, quantity, stock }
  const [variantPicker, setVariantPicker] = useState(null); // { product, variants }
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Search products
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api.get(`/admin/pos/products?q=${encodeURIComponent(q)}`)
        .then(d => setProducts(d.products))
        .finally(() => setLoading(false));
    }, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [q]);

  const subtotal = cart.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
  const discountNum = Math.min(Number(discount) || 0, subtotal);
  const total = subtotal - discountNum;
  const change = Math.max(0, (Number(paidAmount) || 0) - total);

  // ----- cart actions -----
  const addToCart = (product, variant) => {
    const existing = cart.find(c => c.variant_id === variant.id);
    if (existing) {
      if (existing.quantity + 1 > variant.stock) return;
      setCart(cart.map(c => c.variant_id === variant.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, {
        variant_id: variant.id,
        product_id: product.id,
        sku: product.sku,
        name: isAr ? product.name_ar : product.name_en,
        name_ar: product.name_ar,
        name_en: product.name_en,
        size: variant.size,
        color_ar: variant.color_name_ar,
        color_en: variant.color_name_en,
        color_hex: variant.color_hex,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
        stock: variant.stock,
      }]);
    }
    setVariantPicker(null);
  };

  const onProductClick = (product) => {
    if (product.variants.length === 1) {
      addToCart(product, product.variants[0]);
    } else {
      setVariantPicker({ product, variants: product.variants });
    }
  };

  const updateQty = (variant_id, delta) => {
    setCart(cart.flatMap(c => {
      if (c.variant_id !== variant_id) return [c];
      const newQty = c.quantity + delta;
      if (newQty < 1) return [];
      if (newQty > c.stock) return [c];
      return [{ ...c, quantity: newQty }];
    }));
  };

  const removeItem = (variant_id) => setCart(cart.filter(c => c.variant_id !== variant_id));
  const clearCart = () => { if (confirm(isAr ? 'تفريغ السلة؟' : 'Clear cart?')) setCart([]); };

  const openPayment = () => {
    if (cart.length === 0) return;
    setPaidAmount(String(total));
    setPaymentOpen(true);
  };

  const completeSale = async () => {
    if (paymentMethod === 'cash' && (Number(paidAmount) || 0) < total) {
      alert(isAr ? 'المبلغ المدفوع أقل من الإجمالي' : 'Paid amount is less than total');
      return;
    }
    setProcessing(true);
    try {
      const r = await api.post('/admin/pos/sale', {
        items: cart.map(c => ({ variant_id: c.variant_id, quantity: c.quantity })),
        payment_method: paymentMethod,
        paid_amount: Number(paidAmount) || total,
        discount: discountNum,
        customer_name: customerName || (isAr ? 'عميل نقدي' : 'Walk-in'),
        customer_phone: customerPhone || '',
      });
      setReceipt({ ...r, paid: Number(paidAmount) || total, method: paymentMethod });
      setCart([]);
      setDiscount('');
      setPaidAmount('');
      setCustomerName('');
      setCustomerPhone('');
      setPaymentOpen(false);
    } catch (e) {
      alert(e.message);
    } finally { setProcessing(false); }
  };

  return (
    <div className="-m-4 sm:-m-6 grid lg:grid-cols-[1fr_420px] h-[calc(100vh-65px)]">
      {/* LEFT: products grid */}
      <div className="bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-white border-b p-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-5 h-5 text-gray-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isAr ? 'ابحث بالاسم أو SKU أو الباركود…' : 'Search by name, SKU or barcode…'}
              className="input ps-10 h-12 text-base"
            />
            <ScanBarcode className="absolute top-1/2 -translate-y-1/2 end-3 w-5 h-5 text-brand-400" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">{isAr ? 'جاري التحميل…' : 'Loading…'}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">{isAr ? 'لا توجد منتجات متاحة' : 'No products available'}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map(p => (
                <button
                  key={p.id}
                  onClick={() => onProductClick(p)}
                  className="card p-2 text-start hover:shadow-card-hover hover:-translate-y-0.5 transition group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    {p.image && <Image src={p.image} alt="" fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition" />}
                    <span className="absolute top-1 end-1 text-[10px] bg-white/90 px-1.5 py-0.5 rounded font-mono">{p.sku}</span>
                  </div>
                  <div className="text-xs font-semibold text-brand-900 line-clamp-2 min-h-[2rem] mb-1">{isAr ? p.name_ar : p.name_en}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-brand-900">{formatPrice(p.price, locale)}</span>
                    <span className="text-[10px] text-gray-500">{p.variants.length} {isAr ? 'خيار' : 'variants'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: cart sidebar */}
      <aside className="bg-white border-s flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between bg-brand-900 text-white">
          <div className="font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            {isAr ? 'الفاتورة الحالية' : 'Current Bill'}
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs hover:bg-brand-800 px-2 py-1 rounded">
              {isAr ? 'تفريغ' : 'Clear'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Receipt className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">{isAr ? 'اختر منتجاً للبدء' : 'Pick a product to start'}</p>
            </div>
          ) : cart.map(it => (
            <div key={it.variant_id} className="flex gap-2 p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {it.image && <Image src={it.image} alt="" fill sizes="48px" className="object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-brand-900 line-clamp-1">{it.name}</div>
                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: it.color_hex }} />
                  {isAr ? it.color_ar : it.color_en} · {it.size}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center border border-gray-200 rounded">
                    <button onClick={() => updateQty(it.variant_id, -1)} className="p-1 hover:bg-brand-50"><Minus className="w-3 h-3" /></button>
                    <span className="px-2 text-xs font-bold">{it.quantity}</span>
                    <button onClick={() => updateQty(it.variant_id, +1)} disabled={it.quantity >= it.stock} className="p-1 hover:bg-brand-50 disabled:opacity-40"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="text-sm font-bold text-brand-900">{formatPrice(it.price * it.quantity, locale)}</span>
                </div>
              </div>
              <button onClick={() => removeItem(it.variant_id)} className="text-red-400 hover:bg-red-50 p-1 rounded self-start"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t p-4 bg-gray-50 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-600">{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span><strong>{formatPrice(subtotal, locale)}</strong></div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-600" />
            <input type="number" min="0" step="1" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder={isAr ? 'خصم' : 'Discount'} className="input h-9 text-sm flex-1" />
          </div>
          {discountNum > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>{isAr ? 'الخصم' : 'Discount'}</span><strong>-{formatPrice(discountNum, locale)}</strong></div>}
          <div className="flex justify-between items-baseline text-lg pt-2 border-t border-gray-200">
            <strong className="text-brand-900">{isAr ? 'الإجمالي' : 'Total'}</strong>
            <strong className="text-2xl text-brand-900">{formatPrice(total, locale)}</strong>
          </div>
          <button onClick={openPayment} disabled={cart.length === 0} className="btn btn-primary btn-lg w-full text-base h-14 mt-2">
            {isAr ? 'الدفع وإنهاء البيع' : 'Pay & Complete Sale'}
          </button>
        </div>
      </aside>

      {/* Variant picker modal */}
      {variantPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setVariantPicker(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-brand-900">{isAr ? 'اختر المقاس واللون' : 'Choose size & color'}</h3>
              <button onClick={() => setVariantPicker(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="font-bold text-brand-700 mb-3">{isAr ? variantPicker.product.name_ar : variantPicker.product.name_en}</div>
            <div className="grid grid-cols-1 gap-2">
              {variantPicker.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => addToCart(variantPicker.product, v)}
                  disabled={v.stock < 1}
                  className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: v.color_hex }} />
                    <div className="text-start">
                      <div className="font-bold">{isAr ? v.color_name_ar : v.color_name_en}</div>
                      <div className="text-xs text-gray-500">{isAr ? 'مقاس' : 'Size'}: {v.size}</div>
                    </div>
                  </div>
                  <div className={cn('text-xs font-bold px-2 py-1 rounded-full', v.stock > 5 ? 'bg-emerald-100 text-emerald-700' : v.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
                    {v.stock > 0 ? `${v.stock} ${isAr ? 'متاح' : 'in stock'}` : (isAr ? 'نفد' : 'Out')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment modal */}
      {paymentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-brand-900">{isAr ? 'إتمام الدفع' : 'Complete Payment'}</h3>
              <button onClick={() => !processing && setPaymentOpen(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-brand-50 rounded-xl p-4 mb-4 text-center">
              <div className="text-xs text-brand-600 mb-1">{isAr ? 'الإجمالي' : 'Total due'}</div>
              <div className="text-3xl font-extrabold text-brand-900">{formatPrice(total, locale)}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-brand-700 block mb-1 uppercase">{isAr ? 'طريقة الدفع' : 'Payment method'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAY_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={cn('flex flex-col items-center gap-1 p-3 border-2 rounded-xl transition',
                        paymentMethod === m.id ? 'border-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300')}
                    >
                      <m.icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{isAr ? m.label_ar : m.label_en}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="text-xs font-bold text-brand-700 block mb-1 uppercase">{isAr ? 'المبلغ المستلم' : 'Amount received'}</label>
                  <input type="number" autoFocus min="0" step="1" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} className="input h-12 text-lg font-bold" />
                  {Number(paidAmount) > total && (
                    <div className="mt-2 bg-emerald-50 text-emerald-700 rounded-lg p-2 text-sm flex justify-between">
                      <span>{isAr ? 'الباقي للعميل' : 'Change'}</span>
                      <strong>{formatPrice(change, locale)}</strong>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-brand-700 block mb-1 uppercase">{isAr ? 'اسم العميل (اختياري)' : 'Customer name (optional)'}</label>
                  <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input h-10 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-700 block mb-1 uppercase">{isAr ? 'الهاتف' : 'Phone'}</label>
                  <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input h-10 text-sm" />
                </div>
              </div>
            </div>

            <button
              onClick={completeSale}
              disabled={processing}
              className="btn btn-primary btn-lg w-full mt-5 h-14 text-base"
            >
              {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Receipt className="w-5 h-5" />{isAr ? 'تأكيد البيع وطباعة الإيصال' : 'Confirm & Print Receipt'}</>}
            </button>
          </div>
        </div>
      )}

      {/* Receipt modal */}
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} locale={locale} />
      )}
    </div>
  );
}

// ====== Receipt component (printable) ======
function ReceiptModal({ receipt, onClose, locale }) {
  const isAr = locale === 'ar';
  const { order, items, paid, method, change } = receipt;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto">
        <div className="no-print p-3 border-b flex justify-between items-center">
          <h3 className="font-bold text-brand-900">{isAr ? 'إيصال البيع' : 'Sale Receipt'}</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn btn-primary btn-sm">{isAr ? 'طباعة' : 'Print'}</button>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Thermal-style 80mm receipt */}
        <div className="printable p-4 font-mono text-[12px] leading-snug">
          <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-2">
            <div className="text-lg font-extrabold tracking-tight">AURA · أُورا</div>
            <div className="text-[10px] tracking-[0.18em] font-bold">FASHION HOUSE</div>
            <div className="text-[10px] mt-1">Tel: +20 101 025 4819 · aura-fashion.com</div>
          </div>

          <div className="border-b border-dashed border-gray-400 pb-2 mb-2 text-[11px]">
            <div className="flex justify-between"><span>{isAr ? 'رقم الإيصال' : 'Receipt #'}</span><strong>{order.order_number}</strong></div>
            <div className="flex justify-between"><span>{isAr ? 'التاريخ' : 'Date'}</span><span>{new Date(order.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span></div>
            {order.shipping_full_name && <div className="flex justify-between"><span>{isAr ? 'العميل' : 'Customer'}</span><span>{order.shipping_full_name}</span></div>}
            {order.shipping_phone && <div className="flex justify-between"><span>{isAr ? 'الهاتف' : 'Phone'}</span><span>{order.shipping_phone}</span></div>}
          </div>

          <table className="w-full text-[11px] mb-2">
            <thead>
              <tr className="border-b border-dashed border-gray-400">
                <th className="text-start py-1">{isAr ? 'الصنف' : 'Item'}</th>
                <th className="text-end">{isAr ? 'كمية' : 'Qty'}</th>
                <th className="text-end">{isAr ? 'إجمالي' : 'Total'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id} className="border-b border-dotted">
                  <td className="py-1">
                    <div>{isAr ? it.product_name_ar : it.product_name_en}</div>
                    <div className="text-[10px] text-gray-500">{it.size} · {isAr ? it.color_name_ar : it.color_name_en} · {Number(it.unit_price).toFixed(0)}</div>
                  </td>
                  <td className="text-end align-top py-1">{it.quantity}</td>
                  <td className="text-end align-top py-1 font-bold">{Number(it.subtotal).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-dashed border-gray-400 pt-2 text-[12px] space-y-0.5">
            <div className="flex justify-between"><span>{isAr ? 'المجموع' : 'Subtotal'}</span><span>{Number(order.subtotal).toFixed(2)} EGP</span></div>
            {Number(order.discount) > 0 && <div className="flex justify-between"><span>{isAr ? 'الخصم' : 'Discount'}</span><span>-{Number(order.discount).toFixed(2)} EGP</span></div>}
            <div className="flex justify-between text-[14px] font-extrabold border-t border-dashed border-gray-400 pt-1 mt-1">
              <span>{isAr ? 'الإجمالي' : 'TOTAL'}</span>
              <span>{Number(order.total).toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between"><span>{isAr ? 'طريقة الدفع' : 'Payment'}</span><strong>{method.toUpperCase()}</strong></div>
            {method === 'cash' && (
              <>
                <div className="flex justify-between"><span>{isAr ? 'المدفوع' : 'Paid'}</span><span>{Number(paid).toFixed(2)} EGP</span></div>
                <div className="flex justify-between"><span>{isAr ? 'الباقي' : 'Change'}</span><strong>{Number(change).toFixed(2)} EGP</strong></div>
              </>
            )}
          </div>

          <div className="text-center mt-3 pt-2 border-t border-dashed border-gray-400 text-[10px]">
            <div>{isAr ? 'شكراً لشرائك من AURA!' : 'Thank you for shopping at AURA!'}</div>
            <div>{isAr ? 'الإرجاع خلال 14 يوم بالإيصال الأصلي' : 'Returns within 14 days with original receipt'}</div>
            <div className="mt-1">www.aura-fashion.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
