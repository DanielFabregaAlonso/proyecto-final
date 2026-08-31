import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSneaker } from '../api/sneakers';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import SizeSelector from '../components/catalog/SizeSelector';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [sneaker, setSneaker] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedSize(null);
    getSneaker(id)
      .then((data) => setSneaker(data.sneaker))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!selectedSize) {
      showToast('Selecciona una talla', 'error');
      return;
    }
    addItem(sneaker, selectedSize, 1);
    showToast('Añadido al carrito', 'success');
  }

  if (loading) return <p className="p-8 text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!sneaker) return null;

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-8 md:grid-cols-2">
      {sneaker.images?.[0] ? (
        <img src={sneaker.images[0]} alt={sneaker.name} className="aspect-square w-full rounded-md object-cover" />
      ) : (
        <div className="aspect-square w-full rounded-md bg-gray-100" />
      )}
      <div>
        <p className="text-sm text-gray-500">{sneaker.brand}</p>
        <h1 className="text-2xl font-bold text-brand-900">{sneaker.name}</h1>
        <p className="mt-2 text-xl font-semibold">{sneaker.price} €</p>
        <p className="mt-4 text-sm text-gray-600">{sneaker.description}</p>
        <h2 className="mt-6 text-sm font-semibold text-gray-700">Talla</h2>
        <div className="mt-2">
          <SizeSelector sizes={sneaker.sizes} selected={selectedSize} onSelect={setSelectedSize} />
        </div>
        <button className="btn-primary mt-6" onClick={handleAddToCart}>Añadir al carrito</button>
      </div>
    </div>
  );
}
