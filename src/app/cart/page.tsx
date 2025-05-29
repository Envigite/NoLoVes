"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const cart = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  // Formatear precio como pesos chilenos sin decimales
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  // Verificar si el carrito está vacío
  const isCartEmpty = cart.items.length === 0;

  const handleIncreaseQuantity = (
    productId: string,
    currentQuantity: number,
    stock: number,
  ) => {
    setIsUpdating(true);
    // Asegurarse de no exceder el stock disponible
    const newQuantity = Math.min(currentQuantity + 1, stock);
    cart.updateQuantity(productId, newQuantity);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleDecreaseQuantity = (
    productId: string,
    currentQuantity: number,
  ) => {
    setIsUpdating(true);
    if (currentQuantity > 1) {
      cart.updateQuantity(productId, currentQuantity - 1);
    } else {
      cart.removeFromCart(productId);
    }
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemoveItem = (productId: string) => {
    setIsUpdating(true);
    cart.removeFromCart(productId);
    setTimeout(() => setIsUpdating(false), 300);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Carrito de Compras</h1>

      {isCartEmpty ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart size={80} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Parece que aún no has añadido ningún producto a tu carrito.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-700">
                  Productos ({cart.getCartCount()})
                </h2>
              </div>

              {/* Productos en el carrito */}
              <div
                className={`transition-opacity duration-300 ${isUpdating ? "opacity-50" : "opacity-100"}`}
              >
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="p-4 border-b border-gray-200 last:border-0 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Imagen del producto */}
                    <div className="sm:w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product.imageUrl || "/images/placeholder.jpg"}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/placeholder.jpg";
                        }}
                      />
                    </div>

                    {/* Detalles del producto */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">
                        {item.product.title}
                      </h3>
                      <div className="text-gray-500 text-sm">
                        Precio unitario: ${formatPrice(item.product.price)}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-4">
                        {/* Control de cantidad */}
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                          <button
                            onClick={() =>
                              handleDecreaseQuantity(
                                item.product._id,
                                item.quantity,
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleIncreaseQuantity(
                                item.product._id,
                                item.quantity,
                                item.product.stock,
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Eliminar producto */}
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Precio total por producto */}
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-800">
                        ${formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botón para seguir comprando */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  href="/productos"
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  <span>Seguir comprando</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-700 mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${formatPrice(cart.getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (19%)</span>
                  <span>${formatPrice(cart.getTaxes())}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${formatPrice(cart.getTotal())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center"
              >
                <ShoppingBag size={18} className="mr-2" />
                <span>Proceder al pago</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
