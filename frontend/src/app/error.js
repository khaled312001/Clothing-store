'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => { console.error('App error:', error); }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-brand-900 mb-2">حدث خطأ غير متوقع</h1>
        <p className="text-gray-600 mb-6">نأسف للإزعاج، حاول مرة أخرى.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => reset()} className="btn btn-primary btn-md">
            <RefreshCw className="w-4 h-4" />إعادة المحاولة
          </button>
          <Link href="/" className="btn btn-outline btn-md">
            <Home className="w-4 h-4" />الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
