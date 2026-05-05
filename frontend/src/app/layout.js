import './globals.css';
import { Cairo, Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-app', display: 'swap' });

export const metadata = {
  title: { default: 'برمجلي للأزياء · Barmagly Fashion', template: '%s · Barmagly' },
  description: 'متجر إلكتروني متكامل للملابس بثلاثة أقسام: أطفالي، حريمي، رجالي. تشكيلة عصرية بأفضل الخامات وتوصيل لكل المحافظات.',
  keywords: ['ملابس', 'أزياء', 'fashion', 'kids', 'women', 'men', 'برمجلي'],
  authors: [{ name: 'Barmagly', url: 'https://barmagly.tech' }],
  openGraph: {
    title: 'برمجلي للأزياء · Barmagly Fashion',
    description: 'تسوّق أحدث الأزياء بأفضل الأسعار',
    type: 'website',
    locale: 'ar_EG',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
