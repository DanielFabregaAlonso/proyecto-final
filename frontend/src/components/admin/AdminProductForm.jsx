import { useReducer, useState } from 'react';

const CATEGORIES = ['running', 'baloncesto', 'skate', 'lifestyle', 'entrenamiento'];
const GENDERS = ['hombre', 'mujer', 'unisex'];

function sizesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { size: '', stock: '' }];
    case 'UPDATE':
      return state.map((row, index) => (index === action.index ? { ...row, [action.field]: action.value } : row));
    case 'REMOVE':
      return state.filter((_, index) => index !== action.index);
    default:
      return state;
  }
}

export default function AdminProductForm({ sneaker, onSubmit, onCancel }) {
  const isEditing = Boolean(sneaker);
  const [fields, setFields] = useState({
    sku: sneaker?.sku || '',
    name: sneaker?.name || '',
    brand: sneaker?.brand || '',
    category: sneaker?.category || CATEGORIES[0],
    gender: sneaker?.gender || GENDERS[0],
    price: sneaker?.price || '',
    color: sneaker?.color || '',
    description: sneaker?.description || '',
    featured: sneaker?.featured || false,
  });
  const [sizes, dispatchSizes] = useReducer(
    sizesReducer,
    sneaker?.sizes?.map((s) => ({ size: s.size, stock: s.stock })) || [{ size: '', stock: '' }]
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(sneaker?.images?.[0] || null);
  const [submitting, setSubmitting] = useState(false);

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target;
    setFields({ ...fields, [name]: type === 'checkbox' ? checked : value });
  }

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append('sizes', JSON.stringify(sizes.filter((row) => row.size !== '' && row.stock !== '')));
    if (imageFile) formData.append('image', imageFile);

    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-md border border-gray-200 p-4">
      <div className="grid grid-cols-2 gap-4">
        <input className="input-field" name="sku" placeholder="SKU" value={fields.sku} onChange={handleFieldChange} disabled={isEditing} required />
        <input className="input-field" name="name" placeholder="Nombre" value={fields.name} onChange={handleFieldChange} required />
        <input className="input-field" name="brand" placeholder="Marca" value={fields.brand} onChange={handleFieldChange} required />
        <input className="input-field" name="color" placeholder="Color" value={fields.color} onChange={handleFieldChange} required />
        <select className="input-field" name="category" value={fields.category} onChange={handleFieldChange}>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select className="input-field" name="gender" value={fields.gender} onChange={handleFieldChange}>
          {GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
        </select>
        <input className="input-field" type="number" name="price" placeholder="Precio" value={fields.price} onChange={handleFieldChange} required />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="featured" checked={fields.featured} onChange={handleFieldChange} />
          Destacada
        </label>
      </div>
      <textarea className="input-field" name="description" placeholder="Descripción" value={fields.description} onChange={handleFieldChange} rows={3} />

      <div>
        <h3 className="text-sm font-semibold text-gray-700">Tallas y stock</h3>
        {sizes.map((row, index) => (
          <div key={index} className="mt-2 flex items-center gap-2">
            <input className="input-field w-24" type="number" placeholder="Talla" value={row.size} onChange={(event) => dispatchSizes({ type: 'UPDATE', index, field: 'size', value: event.target.value })} />
            <input className="input-field w-24" type="number" placeholder="Stock" value={row.stock} onChange={(event) => dispatchSizes({ type: 'UPDATE', index, field: 'stock', value: event.target.value })} />
            <button type="button" className="text-sm text-red-600" onClick={() => dispatchSizes({ type: 'REMOVE', index })}>Quitar</button>
          </div>
        ))}
        <button type="button" className="btn-secondary mt-2" onClick={() => dispatchSizes({ type: 'ADD' })}>Añadir talla</button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700">Imagen</h3>
        {preview && <img src={preview} alt="preview" className="mt-2 h-24 w-24 rounded object-cover" />}
        <input className="mt-2" type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear zapatilla'}
        </button>
        {onCancel && <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}
