import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export default function CartSummary() {
  const { total, items } = useCart();

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Artículos</span>
        <span>{items.reduce((sum, line) => sum + line.quantity, 0)}</span>
      </div>
      <div className="mt-2 flex justify-between text-lg font-bold text-brand-900">
        <span>Total</span>
        <span>{total} €</span>
      </div>
      <Link
        to="/checkout"
        className={`btn-primary mt-4 block text-center ${items.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
      >
        Finalizar compra
      </Link>
    </div>
  );
}
