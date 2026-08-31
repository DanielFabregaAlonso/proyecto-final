import { Link } from 'react-router-dom';

export default function ProductCard({ sneaker }) {
  return (
    <Link to={`/catalogo/${sneaker._id}`} className="block rounded-md border border-gray-200 p-3 hover:shadow-md transition-shadow">
      {sneaker.images?.[0] ? (
        <img src={sneaker.images[0]} alt={sneaker.name} className="aspect-square w-full rounded object-cover" />
      ) : (
        <div className="aspect-square w-full rounded bg-gray-100" />
      )}
      <p className="mt-2 text-sm text-gray-500">{sneaker.brand}</p>
      <p className="font-semibold text-brand-900">{sneaker.name}</p>
      <p className="text-sm font-medium text-gray-700">{sneaker.price} €</p>
    </Link>
  );
}
