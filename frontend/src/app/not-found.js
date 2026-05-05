import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-9xl font-extrabold text-brand-900 mb-2 leading-none">404</div>
        <div className="w-24 h-1 bg-accent-400 mx-auto rounded-full mb-6" />
        <h1 className="text-3xl font-bold text-brand-900 mb-2">الصفحة غير موجودة</h1>
        <p className="text-gray-600 mb-8">نأسف، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn btn-primary btn-lg">
            <Home className="w-5 h-5" />العودة للرئيسية
          </Link>
          <Link href="/products" className="btn btn-outline btn-lg">
            <Search className="w-5 h-5" />تصفح المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
