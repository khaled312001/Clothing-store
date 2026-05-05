'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Loader2, ImagePlus, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn } from '@/lib/utils';

const COLORS = [
  { en: 'Black', ar: 'أسود', hex: '#0f0f0f' },
  { en: 'White', ar: 'أبيض', hex: '#ffffff' },
  { en: 'Navy',  ar: 'كحلي', hex: '#1e3a5f' },
  { en: 'Gray',  ar: 'رمادي', hex: '#6b7280' },
  { en: 'Red',   ar: 'أحمر', hex: '#dc2626' },
  { en: 'Blue',  ar: 'أزرق', hex: '#2563eb' },
  { en: 'Pink',  ar: 'وردي', hex: '#ec4899' },
  { en: 'Green', ar: 'أخضر', hex: '#16a34a' },
  { en: 'Beige', ar: 'بيج', hex: '#d6c8a8' },
  { en: 'Brown', ar: 'بني', hex: '#7c4a2a' },
];

const COMMON_SIZES = ['XS','S','M','L','XL','XXL','30','32','34','36','38','OneSize','3-6M','6-9M','9-12M','2Y','4Y','6Y','8Y','10Y','12Y'];

export function ProductForm({ productId }) {
  const router = useRouter();
  const { locale } = useUI();
  const isAr = locale === 'ar';

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    sku: '', category_id: '', name_ar: '', name_en: '',
    description_ar: '', description_en: '', brand: '',
    material_ar: '', material_en: '',
    gender: 'unisex', age_group: 'adult',
    price: '', compare_at_price: '',
    is_active: 1, is_featured: 0, is_new: 0,
  });
  const [images, setImages] = useState(['']);
  const [variants, setVariants] = useState([{ size: 'M', color_name_en: 'Black', color_name_ar: 'أسود', color_hex: '#0f0f0f', stock: 10 }]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Load categories (flat list)
  useEffect(() => {
    api.get('/admin/categories').then(d => setCategories(d.categories || []));
  }, []);

  // Load product if editing
  useEffect(() => {
    if (!productId) return;
    api.get(`/admin/products/${productId}`).then(d => {
      const p = d.product;
      setForm({
        sku: p.sku, category_id: p.category_id, name_ar: p.name_ar, name_en: p.name_en,
        description_ar: p.description_ar || '', description_en: p.description_en || '',
        brand: p.brand || '', material_ar: p.material_ar || '', material_en: p.material_en || '',
        gender: p.gender, age_group: p.age_group,
        price: p.price, compare_at_price: p.compare_at_price || '',
        is_active: p.is_active, is_featured: p.is_featured, is_new: p.is_new,
      });
      setImages(d.images.length ? d.images.map(i => i.url) : ['']);
      setVariants(d.variants.length ? d.variants : [{ size: 'M', color_name_en: 'Black', color_name_ar: 'أسود', color_hex: '#0f0f0f', stock: 10 }]);
    });
  }, [productId]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateImg = (i, v) => setImages(arr => arr.map((x, idx) => idx === i ? v : x));
  const addImg = () => setImages(arr => [...arr, '']);
  const removeImg = (i) => setImages(arr => arr.filter((_, idx) => idx !== i));
  const updateVar = (i, k, v) => setVariants(arr => arr.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addVar = () => setVariants(arr => [...arr, { size: 'M', color_name_en: 'Black', color_name_ar: 'أسود', color_hex: '#0f0f0f', stock: 10 }]);
  const removeVar = (i) => setVariants(arr => arr.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
        images: images.filter(Boolean),
        variants: variants.filter(v => v.size && v.color_name_en),
      };
      if (productId) {
        await api.put(`/admin/products/${productId}`, payload);
        setMsg({ ok: true, text: isAr ? 'تم الحفظ' : 'Saved' });
      } else {
        const r = await api.post('/admin/products', payload);
        router.push(`/admin/products/${r.id}/edit`);
      }
    } catch (e) { setMsg({ ok: false, text: e.message }); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Basic info */}
      <div className="card p-5 space-y-3">
        <h2 className="font-bold text-brand-900">{isAr ? 'البيانات الأساسية' : 'Basic info'}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">SKU *</label>
            <input required className="input h-10" value={form.sku} onChange={(e) => update('sku', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'القسم' : 'Category'} *</label>
            <select required className="input h-10" value={form.category_id} onChange={(e) => update('category_id', Number(e.target.value))}>
              <option value="">{isAr ? '— اختر —' : '— select —'}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.parent_name ? `${c.parent_name} › ${isAr ? c.name_ar : c.name_en}` : (isAr ? c.name_ar : c.name_en)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'الاسم (عربي)' : 'Name (Arabic)'} *</label>
            <input required className="input h-10" value={form.name_ar} onChange={(e) => update('name_ar', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'الاسم (إنجليزي)' : 'Name (English)'} *</label>
            <input required className="input h-10" value={form.name_en} onChange={(e) => update('name_en', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
            <textarea rows="3" className="input" value={form.description_ar} onChange={(e) => update('description_ar', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
            <textarea rows="3" className="input" value={form.description_en} onChange={(e) => update('description_en', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'الماركة' : 'Brand'}</label>
            <input className="input h-10" value={form.brand} onChange={(e) => update('brand', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'النوع' : 'Gender'}</label>
              <select className="input h-10" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="unisex">Unisex</option>
                <option value="kids">Kids</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'الفئة العمرية' : 'Age group'}</label>
              <select className="input h-10" value={form.age_group} onChange={(e) => update('age_group', e.target.value)}>
                <option value="adult">Adult</option>
                <option value="newborn">Newborn</option>
                <option value="toddler">Toddler</option>
                <option value="kid">Kid</option>
                <option value="teen">Teen</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'السعر' : 'Price'} (EGP) *</label>
            <input required type="number" step="0.01" className="input h-10" value={form.price} onChange={(e) => update('price', e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'السعر قبل الخصم' : 'Compare-at price'} (EGP)</label>
            <input type="number" step="0.01" className="input h-10" value={form.compare_at_price} onChange={(e) => update('compare_at_price', e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_active}    onChange={(e) => update('is_active',   e.target.checked ? 1 : 0)} /> {isAr ? 'مفعّل' : 'Active'}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_featured} onChange={(e) => update('is_featured', e.target.checked ? 1 : 0)} /> {isAr ? 'مميز' : 'Featured'}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.is_new}      onChange={(e) => update('is_new',      e.target.checked ? 1 : 0)} /> {isAr ? 'جديد' : 'New arrival'}</label>
        </div>
      </div>

      {/* Images */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-900 flex items-center gap-2"><ImagePlus className="w-5 h-5" />{isAr ? 'الصور' : 'Images'}</h2>
          <button type="button" onClick={addImg} className="btn btn-outline btn-sm"><Plus className="w-4 h-4" />{isAr ? 'صورة' : 'Image'}</button>
        </div>
        <p className="text-xs text-gray-500">{isAr ? 'الصق رابط صورة (URL) مباشرة. الصورة الأولى هي الرئيسية.' : 'Paste image URL. First image is the primary.'}</p>
        {images.map((url, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-xs text-brand-500 w-6">#{i + 1}</span>
            {url && <img src={url} alt="" className="w-12 h-14 rounded-lg object-cover bg-gray-100" onError={(e) => e.target.style.display = 'none'} />}
            <input className="input h-10 flex-1" placeholder="https://images.unsplash.com/…" value={url} onChange={(e) => updateImg(i, e.target.value)} />
            <button type="button" onClick={() => removeImg(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Variants */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-900">{isAr ? 'الـvariants (مقاس × لون × مخزون)' : 'Variants (size × color × stock)'}</h2>
          <button type="button" onClick={addVar} className="btn btn-outline btn-sm"><Plus className="w-4 h-4" />Variant</button>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-700 uppercase">
              <tr>
                <th className="text-start px-5 py-2">{isAr ? 'المقاس' : 'Size'}</th>
                <th className="text-start px-3 py-2">{isAr ? 'اللون' : 'Color'}</th>
                <th className="text-start px-3 py-2">HEX</th>
                <th className="text-start px-3 py-2">{isAr ? 'المخزون' : 'Stock'}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={i} className="border-t">
                  <td className="px-5 py-2">
                    <input list="sizes" className="input h-9 w-24" value={v.size} onChange={(e) => updateVar(i, 'size', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <select className="input h-9 w-32" value={v.color_name_en} onChange={(e) => {
                      const c = COLORS.find(c => c.en === e.target.value);
                      if (c) {
                        updateVar(i, 'color_name_en', c.en);
                        updateVar(i, 'color_name_ar', c.ar);
                        updateVar(i, 'color_hex', c.hex);
                      }
                    }}>
                      {COLORS.map(c => <option key={c.en} value={c.en}>{c.en}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded border" style={{ backgroundColor: v.color_hex }} />
                    <input className="input h-9 w-24 font-mono text-xs" value={v.color_hex} onChange={(e) => updateVar(i, 'color_hex', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" className="input h-9 w-20" value={v.stock} onChange={(e) => updateVar(i, 'stock', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => removeVar(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <datalist id="sizes">
          {COMMON_SIZES.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>

      {msg && (
        <div className={cn('text-sm p-2 rounded-lg flex items-center gap-2', msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
          {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="flex gap-2">
        <button disabled={loading} className="btn btn-primary btn-md">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {productId ? (isAr ? 'حفظ التعديلات' : 'Save changes') : (isAr ? 'إنشاء المنتج' : 'Create product')}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} className="btn btn-outline btn-md">{isAr ? 'إلغاء' : 'Cancel'}</button>
      </div>
    </form>
  );
}
