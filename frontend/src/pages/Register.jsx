import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      showToast('Cuenta creada', 'success');
      navigate('/');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-brand-900">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="input-field" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input className="input-field" type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="input-field" type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Creando...' : 'Crear cuenta'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        ¿Ya tienes cuenta? <Link className="text-brand-600" to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
