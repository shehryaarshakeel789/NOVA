import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from "@/api/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const GUEST_CART_KEY = "nova_guest_cart";

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [backendCart, setBackendCart] = useState(null);
  const [guestItems, setGuestItems] = useState(loadGuestCart);
  const [loading, setLoading] = useState(false);
  const wasLoggedIn = useRef(isLoggedIn);

  async function refreshCart() {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const data = await getCart();
      setBackendCart(data);
    } catch {
      setBackendCart(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function mergeGuestCartAndRefresh() {
      if (guestItems.length > 0) {
        for (const item of guestItems) {
          try {
            await apiAddToCart(item.product._id, item.quantity, item.size);
          } catch (err) {
            console.log("Could not merge guest cart item:", err.message);
          }
        }
        setGuestItems([]);
        saveGuestCart([]);
      }
      await refreshCart();
    }

    if (isLoggedIn && !wasLoggedIn.current) {
      mergeGuestCartAndRefresh();
    } else if (!isLoggedIn && wasLoggedIn.current) {
      setBackendCart(null);
    } else if (isLoggedIn) {
      refreshCart();
    }

    wasLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  async function addItem(product, quantity, size) {
    if (isLoggedIn) {
      await apiAddToCart(product._id, quantity, size);
      await refreshCart();
      return;
    }

    setGuestItems((prev) => {
      const existing = prev.find(
        (i) => i.product._id === product._id && i.size === size,
      );
      const updated = existing
        ? prev.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...prev, { id: crypto.randomUUID(), product, quantity, size }];
      saveGuestCart(updated);
      return updated;
    });
  }

  async function updateItem(itemId, quantity) {
    if (isLoggedIn) {
      await apiUpdateCartItem(itemId, quantity);
      await refreshCart();
      return;
    }

    setGuestItems((prev) => {
      const updated = prev.map((i) =>
        i.id === itemId ? { ...i, quantity } : i,
      );
      saveGuestCart(updated);
      return updated;
    });
  }

  async function removeItem(itemId) {
    if (isLoggedIn) {
      await apiRemoveCartItem(itemId);
      await refreshCart();
      return;
    }

    setGuestItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveGuestCart(updated);
      return updated;
    });
  }

  const cart = isLoggedIn
    ? backendCart
    : {
        items: guestItems.map((i) => ({
          _id: i.id,
          product: i.product,
          quantity: i.quantity,
          size: i.size,
        })),
      };

  const itemCount = isLoggedIn
    ? backendCart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
    : guestItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        loading,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
