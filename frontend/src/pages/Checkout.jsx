import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { createOrder } from '../api/orders';

const initialForm = { fullName: '', address: '', city: '', postalCode: '', country: 'España', phone: '' };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await createOrder({
        items: items.map((line) => ({ sneakerId: line.sneakerId, size: line.size, quantity: line.quantity })),
        shippingAddress: form,
      });
      clearCart();
      showToast('Pedido confirmado', 'success');
      navigate('/mis-pedidos');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <p className="p-8 text-center text-gray-500">Tu carrito está vacío.</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-900">Finalizar compra</h1>
      <p className="mt-2 text-gray-600">Total: {total} €</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <input className="input-field" name="fullName" placeholder="Nombre completo" value={form.fullName} onChange={handleChange} required />
        <input className="input-field" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} required />
        <input className="input-field" name="city" placeholder="Ciudad" value={form.city} onChange={handleChange} required />
        <input className="input-field" name="postalCode" placeholder="Código postal" value={form.postalCode} onChange={handleChange} required />
        <input className="input-field" name="country" placeholder="País" value={form.country} onChange={handleChange} required />
        <input className="input-field" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} required />
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  );
}
