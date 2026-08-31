import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-brand-900">Kickz</Link>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/carrito">Carrito</Link>
          {isAuthenticated && !isAdmin && <Link to="/mis-pedidos">Mis pedidos</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
          {isAuthenticated ? (
            <button className="text-brand-600" onClick={handleLogout}>Salir ({user.name})</button>
          ) : (
            <Link to="/login">Entrar</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
