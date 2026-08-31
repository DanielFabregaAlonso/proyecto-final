const CATEGORIES = ['running', 'baloncesto', 'skate', 'lifestyle', 'entrenamiento'];
const GENDERS = ['hombre', 'mujer', 'unisex'];

export default function FilterBar({ filters, onChange }) {
  function handleChange(event) {
    onChange({ ...filters, [event.target.name]: event.target.value });
  }

  return (
    <div className="flex flex-wrap gap-3 border-b border-gray-200 py-4">
      <input className="input-field max-w-xs" type="text" name="search" placeholder="Buscar zapatilla..." value={filters.search} onChange={handleChange} />
      <select className="input-field max-w-[10rem]" name="category" value={filters.category} onChange={handleChange}>
        <option value="">Categoría</option>
        {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <select className="input-field max-w-[10rem]" name="gender" value={filters.gender} onChange={handleChange}>
        <option value="">Género</option>
        {GENDERS.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
      </select>
    </div>
  );
}
