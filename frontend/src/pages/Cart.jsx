import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../hooks/useCart';

export default function Cart() {
  const { items } = useCart();

  if (items.length === 0) {
    return <div className="p-8 text-center text-gray-500">Tu carrito está vacío.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl gap-8 px-4 py-8 md:grid md:grid-cols-3">
      <div className="md:col-span-2">
        {items.map((line) => <CartItem key={line.key} line={line} />)}
      </div>
      <CartSummary />
    </div>
  );
}
