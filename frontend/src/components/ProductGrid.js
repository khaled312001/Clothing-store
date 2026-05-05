import { ProductCard } from './ProductCard';

export function ProductGrid({ products }) {
  if (!products?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[4/5] shimmer" />
          <div className="p-3 space-y-2">
            <div className="h-3 w-1/3 shimmer rounded" />
            <div className="h-4 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/2 shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
