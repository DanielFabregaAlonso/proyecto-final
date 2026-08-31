import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-16 text-center">
      <h1 className="text-3xl font-bold text-brand-900">404</h1>
      <p className="mt-2 text-gray-600">Página no encontrada.</p>
      <Link to="/" className="btn-primary mt-6 inline-block">Volver al inicio</Link>
    </div>
  );
}
