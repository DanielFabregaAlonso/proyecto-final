import { useCart } from '../../hooks/useCart';

export default function CartItem({ line }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4 border-b border-gray-200 py-4">
      {line.image ? (
        <img src={line.image} alt={line.name} className="h-16 w-16 rounded object-cover" />
      ) : (
        <div className="h-16 w-16 rounded bg-gray-100" />
      )}
      <div className="flex-1">
        <p className="font-semibold text-brand-900">{line.name}</p>
        <p className="text-sm text-gray-500">{line.brand} · Talla {line.size}</p>
        <p className="text-sm text-gray-500">{line.price} €</p>
      </div>
      <input
        className="input-field w-16"
        type="number"
        min="1"
        value={line.quantity}
        onChange={(event) => updateQuantity(line.key, Math.max(1, Number(event.target.value)))}
      />
      <button className="text-sm text-red-600" onClick={() => removeItem(line.key)}>Eliminar</button>
    </div>
  );
}
