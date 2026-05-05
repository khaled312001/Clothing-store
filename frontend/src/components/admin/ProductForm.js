'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save, Loader2, ImagePlus, CheckCircle2, XCircle, Upload, Camera, Palette, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const COLORS = [
  { en: 'Black', ar: 'أسود',     hex: '#0f0f0f' },
  { en: 'White', ar: 'أبيض',     hex: '#ffffff' },
  { en: 'Navy',  ar: 'كحلي',     hex: '#1e3a5f' },
  { en: 'Gray',  ar: 'رمادي',    hex: '#6b7280' },
  { en: 'Red',   ar: 'أحمر',     hex: '#dc2626' },
  { en: 'Blue',  ar: 'أزرق',     hex: '#2563eb' },
  { en: 'Pink',  ar: 'وردي',     hex: '#ec4899' },
  { en: 'Green', ar: 'أخضر',     hex: '#16a34a' },
  { en: 'Beige', ar: 'بيج',      hex: '#d6c8a8' },
  { en: 'Brown', ar: 'بني',      hex: '#7c4a2a' },
  { en: 'Purple',ar: 'بنفسجي',   hex: '#7c3aed' },
  { en: 'Yellow',ar: 'أصفر',     hex: '#eab308' },
  { en: 'Olive', ar: 'زيتي',     hex: '#556b2f' },
];

const COMMON_SIZES = ['XS','S','M','L','XL','XXL','30','32','34','36','38','OneSize','3-6M','6-9M','9-12M','2Y','4Y','6Y','8Y','10Y','12Y'];

// ===== Reusable image uploader (file picker + drag&drop + URL paste) =====
function ImageUploader({ value = '', onChange, onRemove, compact = false, isAr }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of files) fd.append('files', f);
      const token = typeof window !== 'undefined' ? localStorage.getItem('bmg_token') : null;
      const res = await fetch(`${API_BASE}/admin/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      // Single slot — take first; multi-add handled by parent
      if (data.urls?.length) onChange(data.urls[0]);
    } catch (e) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    upload(e.dataTransfer.files);
  };

  return (
    <div className={cn('flex gap-2 items-stretch', compact && 'items-center')}>
      {/* Preview */}
      {value ? (
        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 group">
          <img src={value} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
          {onRemove && (
            <button type="button" onClick={onRemove} className="absolute inset-0 bg-red-500/0 hover:bg-red-500/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'w-16 h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer shrink-0 transition',
            dragOver ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 bg-gray-50'
          )}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-600" /> : <ImagePlus className="w-4 h-4 text-gray-400" />}
        </div>
      )}

      <div className="flex-1 flex gap-2">
        <input
          type="text"
          placeholder={isAr ? 'الصق رابط الصورة أو ارفع من الجهاز…' : 'Paste image URL or upload…'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input h-10 flex-1 text-xs"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn btn-outline btn-sm h-10 px-3 whitespace-nowrap"
          title={isAr ? 'رفع من الجهاز/الكاميرا' : 'Upload from device/camera'}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </button>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ===== Multiple-image uploader (drag&drop multiple files at once) =====
function MultiImageUploader({ urls, onChange, isAr }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (const f of files) fd.append('files', f);
      const token = typeof window !== 'undefined' ? localStorage.getItem('bmg_token') : null;
      const res = await fetch(`${API_BASE}/admin/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange([...urls.filter(Boolean), ...(data.urls || [])]);
    } catch (e) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {urls.filter(Boolean).map((u, i) => (
          <div key={`${u}-${i}`} className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-100 group">
            <img src={u} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1 start-1 bg-accent-400 text-brand-950 text-[9px] font-bold px-1.5 py-0.5 rounded">
                {isAr ? 'رئيسية' : 'MAIN'}
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(urls.filter((_, idx) => idx !== i))}
              className="absolute inset-0 bg-red-500/0 hover:bg-red-500/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-24 rounded-lg border-2 border-dashed border-brand-300 hover:border-brand-500 hover:bg-brand-50 flex flex-col items-center justify-center gap-1 transition group"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin text-brand-600" /> : (
            <>
              <Camera className="w-5 h-5 text-brand-500 group-hover:text-brand-700" />
              <span className="text-[10px] font-bold text-brand-600">{isAr ? 'إضافة' : 'Add'}</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={isAr ? 'أو الصق رابط صورة هنا واضغط Enter' : 'Or paste an image URL and press Enter'}
          className="input h-9 flex-1 text-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
              e.preventDefault();
              onChange([...urls.filter(Boolean), e.target.value.trim()]);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}

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
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([{ size: 'M', color_name_en: 'Black', color_name_ar: 'أسود', color_hex: '#0f0f0f', stock: 10, price_override: '', compare_at_override: '' }]);
  const [variantImages, setVariantImages] = useState({}); // { "Black": ["url1", "url2"], "White": [] }
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    api.get('/admin/categories').then(d => setCategories(d.categories || []));
  }, []);

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
      setImages(d.images.length ? d.images.map(i => i.url) : []);
      setVariants(d.variants.length
        ? d.variants.map(v => ({
            ...v,
            price_override: v.price_override ?? '',
            compare_at_override: v.compare_at_override ?? '',
          }))
        : [{ size: 'M', color_name_en: 'Black', color_name_ar: 'أسود', color_hex: '#0f0f0f', stock: 10, price_override: '', compare_at_override: '' }]
      );
      // Convert variant_images object {Black: [{url}]} → {Black: ["url"]}
      const vi = {};
      for (const [color, arr] of Object.entries(d.variant_images || {})) {
        vi[color] = arr.map(x => typeof x === 'string' ? x : x.url);
      }
      setVariantImages(vi);
    });
  }, [productId]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updateVar = (i, k, v) => setVariants(arr => arr.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addVar = () => setVariants(arr => [...arr, { size: 'M', color_name_en: 'Black', color_name_ar: 'أسود', color_hex: '#0f0f0f', stock: 10, price_override: '', compare_at_override: '' }]);
  const removeVar = (i) => setVariants(arr => arr.filter((_, idx) => idx !== i));

  // Unique colors used across variants
  const usedColors = [...new Map(variants.map(v => [v.color_name_en, v])).values()];

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
        variants: variants.filter(v => v.size && v.color_name_en).map(v => ({
          ...v,
          stock: Number(v.stock) || 0,
          price_override: v.price_override !== '' ? Number(v.price_override) : null,
          compare_at_override: v.compare_at_override !== '' ? Number(v.compare_at_override) : null,
        })),
        variant_images: variantImages,
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
            <label className="text-xs font-bold text-brand-700 mb-1 block">{isAr ? 'السعر الأساسي' : 'Base Price'} (EGP) *</label>
            <input required type="number" step="0.01" className="input h-10" value={form.price} onChange={(e) => update('price', e.target.value)} />
            <p className="text-[10px] text-gray-500 mt-1">{isAr ? 'يمكن تجاوزه لكل variant بسعر مختلف بالأسفل' : 'Can be overridden per variant below'}</p>
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

      {/* Default product images */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-900 flex items-center gap-2">
            <ImagePlus className="w-5 h-5" />
            {isAr ? 'الصور الأساسية للمنتج' : 'Default product images'}
          </h2>
        </div>
        <p className="text-xs text-gray-500">{isAr
          ? 'تظهر هذه الصور افتراضياً. الصورة الأولى هي الرئيسية. يمكنك إضافة صور خاصة بكل لون بالأسفل.'
          : 'Default gallery. First image is primary. You can add color-specific images below.'}</p>
        <MultiImageUploader urls={images} onChange={setImages} isAr={isAr} />
      </div>

      {/* Variants table with per-variant pricing */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-brand-900">{isAr ? 'الـvariants (مقاس × لون × مخزون × سعر)' : 'Variants (size × color × stock × price)'}</h2>
          <button type="button" onClick={addVar} className="btn btn-outline btn-sm"><Plus className="w-4 h-4" />Variant</button>
        </div>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-brand-700 uppercase">
              <tr>
                <th className="text-start px-5 py-2">{isAr ? 'المقاس' : 'Size'}</th>
                <th className="text-start px-3 py-2">{isAr ? 'اللون' : 'Color'}</th>
                <th className="text-start px-3 py-2">{isAr ? 'المخزون' : 'Stock'}</th>
                <th className="text-start px-3 py-2">
                  {isAr ? 'سعر مخصص' : 'Override price'}
                  <span className="block text-[9px] text-gray-400 normal-case font-normal">{isAr ? '(اتركه فاضي للسعر الأساسي)' : '(empty = base price)'}</span>
                </th>
                <th className="text-start px-3 py-2">{isAr ? 'سعر قبل الخصم' : 'Compare-at'}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={i} className="border-t">
                  <td className="px-5 py-2">
                    <input list="sizes" className="input h-9 w-20" value={v.size} onChange={(e) => updateVar(i, 'size', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border" style={{ backgroundColor: v.color_hex }} />
                      <select className="input h-9 w-28" value={v.color_name_en} onChange={(e) => {
                        const c = COLORS.find(c => c.en === e.target.value);
                        if (c) {
                          updateVar(i, 'color_name_en', c.en);
                          updateVar(i, 'color_name_ar', c.ar);
                          updateVar(i, 'color_hex', c.hex);
                        }
                      }}>
                        {COLORS.map(c => <option key={c.en} value={c.en}>{c.en}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" min="0" className="input h-9 w-20" value={v.stock} onChange={(e) => updateVar(i, 'stock', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" placeholder={String(form.price || '—')} className="input h-9 w-24" value={v.price_override} onChange={(e) => updateVar(i, 'price_override', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" placeholder="—" className="input h-9 w-24" value={v.compare_at_override} onChange={(e) => updateVar(i, 'compare_at_override', e.target.value)} />
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

      {/* Per-color image galleries */}
      {usedColors.length > 0 && (
        <div className="card p-5 space-y-4">
          <div>
            <h2 className="font-bold text-brand-900 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {isAr ? 'صور خاصة بكل لون' : 'Color-specific image galleries'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isAr
                ? 'لما العميل يختار لون معين، يشاهد الصور المخصصة له. لو ما رفعتش صور للون، تظهر الصور الأساسية.'
                : "When a customer picks a color, they see its dedicated photos. If you don't add color images, the default gallery shows instead."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {usedColors.map(c => (
              <div key={c.color_name_en} className="border border-gray-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full border-2 border-gray-300" style={{ backgroundColor: c.color_hex }} />
                  <span className="font-bold text-brand-900">{isAr ? c.color_name_ar : c.color_name_en}</span>
                  <span className="text-xs text-gray-500 ms-auto">
                    {(variantImages[c.color_name_en] || []).filter(Boolean).length} {isAr ? 'صورة' : 'images'}
                  </span>
                </div>
                <MultiImageUploader
                  urls={variantImages[c.color_name_en] || []}
                  onChange={(arr) => setVariantImages(prev => ({ ...prev, [c.color_name_en]: arr }))}
                  isAr={isAr}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {msg && (
        <div className={cn('text-sm p-2 rounded-lg flex items-center gap-2', msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
          {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="flex gap-2 sticky bottom-4 z-10">
        <button disabled={loading} className="btn btn-primary btn-lg flex-1 shadow-lg">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {productId ? (isAr ? 'حفظ التغييرات' : 'Save changes') : (isAr ? 'إنشاء المنتج' : 'Create product')}
        </button>
      </div>
    </form>
  );
}
