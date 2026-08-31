import ProductCard from './ProductCard';

export default function ProductGrid({ items, sentinelRef }) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-gray-500">No se encontraron zapatillas.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((sneaker) => <ProductCard key={sneaker._id} sneaker={sneaker} />)}
      </div>
      {sentinelRef && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}
