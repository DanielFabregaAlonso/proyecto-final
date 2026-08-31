import { useState } from 'react';
import FilterBar from '../components/catalog/FilterBar';
import ProductGrid from '../components/catalog/ProductGrid';
import { useDebounce } from '../hooks/useDebounce';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';

export default function Catalog() {
  const [filters, setFilters] = useState({ search: '', category: '', gender: '' });
  const debouncedSearch = useDebounce(filters.search, 400);
  const { items, loading, error, sentinelRef } = useInfiniteProducts({ ...filters, search: debouncedSearch });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-900">Catálogo</h1>
      <FilterBar filters={filters} onChange={setFilters} />
      {error && <p className="py-4 text-red-600">{error}</p>}
      <ProductGrid items={items} sentinelRef={sentinelRef} />
      {loading && <p className="py-4 text-center text-gray-500">Cargando...</p>}
    </div>
  );
}
