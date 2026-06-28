import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart,    setCart]    = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const { isLoggedIn }        = useAuth();

  const fetchCart = async () => {
    if (!isLoggedIn) { setCart({ items: [], total: 0, itemCount: 0 }); return; }
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data);
    } catch {
      setCart({ items: [], total: 0, itemCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [isLoggedIn]);

  const addToCart = async (productId, quantity = 1) => {
    await cartAPI.addToCart({ productId, quantity });
    await fetchCart();
  };

  const updateItem = async (cartItemId, quantity) => {
    await cartAPI.updateCart({ cartItemId, quantity });
    await fetchCart();
  };

  const removeItem = async (cartItemId) => {
    await cartAPI.removeItem(cartItemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart,
      addToCart, updateItem, removeItem, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);