"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  // Formatear precio como pesos chilenos sin decimales
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Formato específico para campos de tarjeta
    if (name === "cardNumber") {
      // Solo permitir números y formatear como XXXX XXXX XXXX XXXX
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .slice(0, 19);
      setFormData({ ...formData, [name]: formatted });
    } else if (name === "cardExpiry") {
      // Formato MM/YY
      const cleaned = value.replace(/\D/g, "");
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      setFormData({ ...formData, [name]: formatted });
    } else if (name === "cardCvc") {
      // Solo permitir 3-4 dígitos
      const formatted = value.replace(/\D/g, "").slice(0, 4);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.cardNumber ||
      !formData.cardExpiry ||
      !formData.cardCvc
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Simulación del procesamiento de pago
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      // Vaciar carrito después de la compra
      cart.clearCart();
      // Redirigir a la página de confirmación después de un momento
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }, 2000);
  };

  // Si el carrito está vacío, redirigir a la página de productos
  if (cart.items.length === 0 && !isComplete) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            No puedes proceder al pago sin productos en tu carrito.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-300"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    );
  }

  // Si el pago se ha completado
  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Compra completada!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu pedido ha sido procesado exitosamente. Serás redirigido a la
            página principal en unos segundos.
          </p>
          <p className="text-sm text-gray-500">
            (Recuerda que esta es una tienda ficticia, ¡no se ha realizado
            ningún cargo real!)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finalizar Compra</h1>
        <Link
          href="/cart"
          className="flex items-center text-green-600 hover:text-green-800 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span>Volver al carrito</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario de pago */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium text-gray-800 mb-6">
              Información de pago
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información personal */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Información personal
                  </h3>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Dirección de envío */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Dirección de envío
                  </h3>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Código postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Información de pago */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Información de la tarjeta
                  </h3>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardExpiry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fecha de expiración (MM/AA)
                  </label>
                  <input
                    type="text"
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardCvc"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        <span>Procesando pago...</span>
                      </>
                    ) : (
                      <span>Completar compra</span>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    * Esta es una tienda ficticia. No se realizará ningún cargo
                    real.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-700 mb-4">
              Resumen del pedido
            </h2>

            {/* Lista de productos */}
            <div className="max-h-80 overflow-y-auto mb-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-200 last:border-0"
                >
                  <div className="w-16 h-16 flex-shrink-0">
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
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800">
                      {item.product.title}
                    </h3>
                    <div className="text-xs text-gray-500">
                      Cantidad: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      ${formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="space-y-3 mb-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
