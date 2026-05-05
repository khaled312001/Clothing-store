export const dynamic = 'force-static';

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /checkout
Disallow: /cart
Disallow: /api/

Sitemap: /sitemap.xml
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
