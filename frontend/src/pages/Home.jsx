import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/catalog/ProductGrid';
import { listSneakers } from '../api/sneakers';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // The backend doesn't filter by `featured` server-side, so fetch a page
    // covering the full seeded catalog (60 sneakers) and filter client-side.
    listSneakers({ limit: 60 })
      .then((data) => setFeatured(data.items.filter((sneaker) => sneaker.featured)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-brand-900 py-16 text-center text-white">
        <h1 className="text-4xl font-bold">Kickz</h1>
        <p className="mt-2 text-brand-100">Encuentra tu próxima zapatilla deportiva</p>
        <Link to="/catalogo" className="btn-primary mt-6 inline-block bg-brand-600">Ver catálogo</Link>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl font-bold text-brand-900">Destacadas</h2>
        {error && <p className="py-4 text-red-600">{error}</p>}
        {loading ? (
          <p className="py-8 text-center text-gray-500">Cargando...</p>
        ) : (
          !error && <ProductGrid items={featured} sentinelRef={null} />
        )}
      </section>
    </div>
  );
}
