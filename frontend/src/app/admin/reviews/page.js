'use client';

import { useEffect, useState } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useUI } from '@/lib/store';
import { cn, formatDate } from '@/lib/utils';

export default function AdminReviews() {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const [reviews, setReviews] = useState([]);

  const load = () => api.get('/admin/reviews').then(d => setReviews(d.reviews));
  useEffect(() => { load(); }, []);

  const toggleApprove = async (r) => {
    await api.put(`/admin/reviews/${r.id}`, { is_approved: r.is_approved ? 0 : 1 });
    load();
  };
  const remove = async (id) => {
    if (!confirm(isAr ? 'حذف؟' : 'Delete?')) return;
    await api.del(`/admin/reviews/${id}`);
    load();
  };

  return (
    <div className="space-y-3">
      {reviews.map(r => (
        <div key={r.id} className="card p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="font-bold text-brand-900">{r.user_name}</div>
                <span className="text-xs text-gray-400">·</span>
                <div className="text-xs text-gray-500">{r.product_name}</div>
                <span className="text-xs text-gray-400">·</span>
                <div className="text-xs text-gray-500">{formatDate(r.created_at, locale)}</div>
                <div className="flex items-center gap-0.5 ms-2">
                  {[1,2,3,4,5].map(i => <Star key={i} className={cn('w-3.5 h-3.5', i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />)}
                </div>
              </div>
              {r.title && <div className="font-bold text-brand-900 mb-1">{r.title}</div>}
              <p className="text-sm text-gray-700">{r.comment}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => toggleApprove(r)} className={cn('p-2 rounded-lg', r.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-emerald-50')}>
                {r.is_approved ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </button>
              <button onClick={() => remove(r.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
      {reviews.length === 0 && <div className="card p-8 text-center text-gray-400">{isAr ? 'لا توجد تقييمات' : 'No reviews'}</div>}
    </div>
  );
}
