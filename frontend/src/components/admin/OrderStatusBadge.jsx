const STATUS_STYLES = {
  pendiente: 'bg-gray-100 text-gray-700',
  pagado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-yellow-100 text-yellow-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};

export default function OrderStatusBadge({ status }) {
  return <span className={`badge ${STATUS_STYLES[status] || STATUS_STYLES.pendiente}`}>{status}</span>;
}
