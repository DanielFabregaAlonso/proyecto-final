import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orders';

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8 text-center text-gray-500">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (orders.length === 0) return <p className="p-8 text-center text-gray-500">Todavía no tienes pedidos.</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-900">Mis pedidos</h1>
      <div className="mt-6 flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-md border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="badge bg-brand-100 text-brand-700">{STATUS_LABELS[order.status]}</span>
              <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <ul className="mt-3 text-sm text-gray-700">
              {order.items.map((item, index) => (
                <li key={index}>{item.quantity} x {item.sneaker?.name || 'Zapatilla eliminada'} (talla {item.size})</li>
              ))}
            </ul>
            <p className="mt-3 text-right font-semibold text-brand-900">Total: {order.total} €</p>
          </div>
        ))}
      </div>
    </div>
  );
}
