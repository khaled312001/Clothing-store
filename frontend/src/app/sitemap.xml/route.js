export const revalidate = 3600;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const STATIC_PATHS = [
  '/', '/about', '/contact', '/faq', '/shipping', '/returns', '/sizing', '/privacy',
  '/products', '/auth/login', '/auth/register',
  '/category/kids', '/category/women', '/category/men',
];

export async function GET() {
  let urls = [...STATIC_PATHS];

  // Add product pages dynamically
  try {
    const r = await fetch(`${API}/products?limit=200`, { next: { revalidate: 3600 } });
    if (r.ok) {
      const data = await r.json();
      data.products?.forEach(p => urls.push(`/product/${p.slug}`));
    }
  } catch {}

  try {
    const r = await fetch(`${API}/categories`, { next: { revalidate: 3600 } });
    if (r.ok) {
      const data = await r.json();
      const walk = (cats) => cats.forEach(c => {
        urls.push(`/category/${c.slug}`);
        if (c.children) walk(c.children);
      });
      walk(data.categories || []);
    }
  } catch {}

  // Dedupe
  urls = [...new Set(urls)];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><changefreq>weekly</changefreq><priority>${u === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n')}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
