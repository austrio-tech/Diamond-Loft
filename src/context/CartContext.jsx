import { createContext, useContext, useReducer, useState } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const idx = state.findIndex((i) => i.id === action.product.id);
      if (idx !== -1) {
        return state.map((i, n) =>
          n === idx ? { ...i, qty: i.qty + action.qty } : i
        );
      }
      return [...state, { ...action.product, qty: action.qty }];
    }
    case "REMOVE":
      return state.filter((i) => i.id !== action.id);
    case "UPDATE":
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product, qty = 1) => {
    dispatch({ type: "ADD", product, qty });
    setIsOpen(true);
  };
  const removeFromCart = (id) => dispatch({ type: "REMOVE", id });
  const updateQty    = (id, qty) => dispatch({ type: "UPDATE", id, qty });
  const clearCart    = () => dispatch({ type: "CLEAR" });
  const openCart     = () => setIsOpen(true);
  const closeCart    = () => setIsOpen(false);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQty, clearCart,
        totalItems, totalPrice,
        isOpen, openCart, closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
