export default function SizeSelector({ sizes, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((sizeEntry) => {
        const isOutOfStock = sizeEntry.stock === 0;
        const isSelected = selected === sizeEntry.size;
        return (
          <button
            key={sizeEntry.size}
            type="button"
            disabled={isOutOfStock}
            onClick={() => onSelect(sizeEntry.size)}
            className={`rounded-md border px-3 py-2 text-sm ${
              isOutOfStock
                ? 'cursor-not-allowed border-gray-200 text-gray-300 line-through'
                : isSelected
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-gray-300 text-gray-700 hover:border-brand-600'
            }`}
          >
            {sizeEntry.size}
          </button>
        );
      })}
    </div>
  );
}
