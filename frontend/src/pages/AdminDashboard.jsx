import { useEffect, useState } from 'react';
import { listSneakers, createSneaker, updateSneaker, deleteSneaker } from '../api/sneakers';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import AdminProductForm from '../components/admin/AdminProductForm';
import OrderStatusBadge from '../components/admin/OrderStatusBadge';
import { useToast } from '../hooks/useToast';

const ORDER_STATUSES = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [tab, setTab] = useState('catalogo');
  const [sneakers, setSneakers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingSneaker, setEditingSneaker] = useState(undefined);
  const [showForm, setShowForm] = useState(false);

  function loadSneakers() {
    listSneakers({ limit: 100 })
      .then((data) => setSneakers(data.items))
      .catch((error) => showToast(error.message, 'error'));
  }

  function loadOrders() {
    getAllOrders()
      .then((data) => setOrders(data.orders))
      .catch((error) => showToast(error.message, 'error'));
  }

  useEffect(() => {
    loadSneakers();
    loadOrders();
  }, []);

  async function handleCreateOrUpdate(formData) {
    try {
      if (editingSneaker) {
        await updateSneaker(editingSneaker._id, formData);
        showToast('Zapatilla actualizada', 'success');
      } else {
        await createSneaker(formData);
        showToast('Zapatilla creada', 'success');
      }
      setShowForm(false);
      setEditingSneaker(undefined);
      loadSneakers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSneaker(id);
      showToast('Zapatilla eliminada', 'success');
      loadSneakers();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateOrderStatus(id, status);
      showToast('Estado actualizado', 'success');
      loadOrders();
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-900">Panel de administración</h1>
      <div className="mt-4 flex gap-4 border-b border-gray-200">
        <button className={`pb-2 ${tab === 'catalogo' ? 'border-b-2 border-brand-600 font-semibold text-brand-900' : 'text-gray-500'}`} onClick={() => setTab('catalogo')}>Catálogo</button>
        <button className={`pb-2 ${tab === 'pedidos' ? 'border-b-2 border-brand-600 font-semibold text-brand-900' : 'text-gray-500'}`} onClick={() => setTab('pedidos')}>Pedidos</button>
      </div>

      {tab === 'catalogo' && (
        <div className="mt-6">
          {showForm ? (
            <AdminProductForm key={editingSneaker?._id ?? 'new'} sneaker={editingSneaker} onSubmit={handleCreateOrUpdate} onCancel={() => { setShowForm(false); setEditingSneaker(undefined); }} />
          ) : (
            <button className="btn-primary" onClick={() => setShowForm(true)}>Nueva zapatilla</button>
          )}
          <div className="mt-6 flex flex-col gap-2">
            {sneakers.map((sneaker) => (
              <div key={sneaker._id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <div>
                  <p className="font-semibold text-brand-900">{sneaker.name}</p>
                  <p className="text-sm text-gray-500">{sneaker.sku} · {sneaker.price} €</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn-secondary" onClick={() => { setEditingSneaker(sneaker); setShowForm(true); }}>Editar</button>
                  <button className="text-sm text-red-600" onClick={() => handleDelete(sneaker._id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pedidos' && (
        <div className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order._id} className="rounded-md border border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-brand-900">{order.user?.name} ({order.user?.email})</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-sm text-gray-500">Total: {order.total} €</p>
              <select className="input-field mt-2 w-40" value={order.status} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
