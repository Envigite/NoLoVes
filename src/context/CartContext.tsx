"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Definir la interfaz del producto
interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  stock: number;
}

// Definir la interfaz del ítem del carrito
interface CartItem {
  product: Product;
  quantity: number;
}

// Definir la interfaz del contexto del carrito
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getSubtotal: () => number;
  getTaxes: () => number;
  getTotal: () => number;
}

// Crear el contexto
const CartContext = createContext<CartContextType | null>(null);

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// Proveedor del contexto
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito del localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [items]);

  // Añadir producto al carrito
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product._id === product._id,
      );

      if (existingItem) {
        // Actualizar cantidad si el producto ya está en el carrito
        return prevItems.map((item) =>
          item.product._id === product._id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item,
        );
      } else {
        // Añadir nuevo producto al carrito
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId),
    );
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Vaciar el carrito
  const clearCart = () => {
    setItems([]);
  };

  // Obtener número total de productos en el carrito
  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calcular subtotal (sin impuestos)
  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  // Calcular impuestos (19% IVA)
  const getTaxes = () => {
    return getSubtotal() * 0.19;
  };

  // Calcular total
  const getTotal = () => {
    return getSubtotal() + getTaxes();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getSubtotal,
        getTaxes,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
