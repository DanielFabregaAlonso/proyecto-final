import { createContext, useEffect, useReducer } from 'react';

export const CartContext = createContext(null);

const STORAGE_KEY = 'kickz_cart';

function lineKey(sneakerId, size) {
  return `${sneakerId}-${size}`;
}

function readStoredCart() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { sneaker, size, quantity } = action.payload;
      const key = lineKey(sneaker._id, size);
      const existing = state.find((line) => line.key === key);
      if (existing) {
        return state.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + quantity } : line
        );
      }
      return [
        ...state,
        {
          key,
          sneakerId: sneaker._id,
          name: sneaker.name,
          brand: sneaker.brand,
          price: sneaker.price,
          image: sneaker.images?.[0] || null,
          size,
          quantity,
        },
      ];
    }
    case 'REMOVE_ITEM':
      return state.filter((line) => line.key !== action.payload.key);
    case 'UPDATE_QUANTITY':
      return state.map((line) =>
        line.key === action.payload.key ? { ...line, quantity: action.payload.quantity } : line
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(sneaker, size, quantity = 1) {
    dispatch({ type: 'ADD_ITEM', payload: { sneaker, size, quantity } });
  }

  function removeItem(key) {
    dispatch({ type: 'REMOVE_ITEM', payload: { key } });
  }

  function updateQuantity(key, quantity) {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' });
  }

  const total = items.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}
