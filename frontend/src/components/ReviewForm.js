'use client';

import { useState } from 'react';
import { Star, Loader2, Send, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth, useUI } from '@/lib/store';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ReviewForm({ productId, onSubmitted }) {
  const { locale } = useUI();
  const isAr = locale === 'ar';
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!user) {
    return (
      <div className="card p-5 text-center bg-brand-50 border border-brand-100">
        <p className="text-brand-800 mb-3 text-sm">
          {isAr ? 'سجّل دخولك لتقييم هذا المنتج' : 'Sign in to review this product'}
        </p>
        <Link href={`/auth/login?next=/product`} className="btn btn-primary btn-sm">
          {isAr ? 'تسجيل الدخول' : 'Sign in'}
        </Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await api.post('/reviews', { product_id: productId, rating, title, comment });
      setMsg({ ok: true, text: isAr ? 'تم إرسال تقييمك، شكراً لك!' : 'Your review was submitted, thank you!' });
      setTitle('');
      setComment('');
      onSubmitted?.();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="card p-5 space-y-3">
      <h4 className="font-bold text-brand-900">{isAr ? 'اكتب تقييمك' : 'Write a review'}</h4>

      <div>
        <label className="text-sm font-semibold text-brand-800 block mb-1">{isAr ? 'تقييمك' : 'Your rating'}</label>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => (
            <button
              type="button"
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              className="text-2xl"
            >
              <Star className={cn('w-7 h-7 transition', i <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-brand-800 block mb-1">{isAr ? 'عنوان' : 'Title'}</label>
        <input className="input h-11" maxLength={150} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={isAr ? 'عنوان قصير' : 'Short headline'} />
      </div>

      <div>
        <label className="text-sm font-semibold text-brand-800 block mb-1">{isAr ? 'التعليق' : 'Comment'}</label>
        <textarea required rows="3" className="input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder={isAr ? 'شارك تجربتك مع المنتج…' : 'Share your experience with the product…'} />
      </div>

      {msg && (
        <div className={`text-sm flex items-center gap-1.5 ${msg.ok ? 'text-emerald-600' : 'text-red-600'}`}>
          {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <button disabled={loading} className="btn btn-primary btn-md">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isAr ? 'إرسال التقييم' : 'Submit review'}
      </button>
    </form>
  );
}
