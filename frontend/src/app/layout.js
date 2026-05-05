import './globals.css';
import { Cairo, Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-app', display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://aura-fashion.example.com'),
  title: {
    default: 'AURA · أُورا للأزياء — متجر إلكتروني متكامل للأزياء العصرية',
    template: '%s · AURA Fashion',
  },
  description: 'متجر AURA الإلكتروني المتكامل للملابس بثلاثة أقسام: أطفالي، حريمي، رجالي. تشكيلة عصرية بأفضل الخامات وتوصيل لكل المحافظات في مصر.',
  keywords: ['ملابس', 'أزياء', 'تسوق اونلاين', 'fashion', 'kids', 'women', 'men', 'AURA', 'أُورا', 'متجر ملابس مصر'],
  authors: [{ name: 'Barmagly', url: 'https://barmagly.tech' }],
  creator: 'AURA Fashion House',
  publisher: 'AURA Fashion House',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  manifest: '/manifest.webmanifest',
  themeColor: '#1f5188',
  openGraph: {
    title: 'AURA · أُورا للأزياء',
    description: 'تسوّق أحدث الأزياء العصرية بأفضل الأسعار وتوصيل سريع لكل المحافظات.',
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: 'en_US',
    siteName: 'AURA Fashion',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA · أُورا للأزياء',
    description: 'تسوّق أحدث الأزياء العصرية بأفضل الأسعار',
  },
  alternates: {
    canonical: '/',
    languages: { 'ar-EG': '/?lang=ar', 'en-US': '/?lang=en' },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'AURA Fashion House',
  alternateName: 'أُورا للأزياء',
  url: 'https://aura-fashion.example.com',
  logo: 'https://aura-fashion.example.com/logo-mark.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+20-101-025-4819',
    contactType: 'customer service',
    availableLanguage: ['Arabic', 'English'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EG',
  },
  sameAs: [
    'https://facebook.com/aurafashion',
    'https://instagram.com/aurafashion',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
