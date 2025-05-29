"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categories: string[];
  subcategories: string[];
  isVisible: boolean;
}

export default function ProductosComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error(`Error al cargar productos: ${response.status}`);
        }

        const data = await response.json();
        // Filtrar productos visibles y tomar los primeros 8
        const visibleProducts = data
          .filter((product: Product) => product.isVisible)
          .slice(0, 8);

        setProducts(visibleProducts);
      } catch (error) {
        console.error("Error cargando productos:", error);
        setError(
          "No se pudieron cargar los productos. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Formatear precio como pesos chilenos sin decimales
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se encontraron productos destacados.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          href={`/productos/${product._id}`}
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
        >
          <div className="h-48 overflow-hidden relative">
            <img
              src={product.imageUrl || "/images/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
              }}
            />
            {product.stock <= 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md z-10">
                Agotado
              </div>
            )}

            {/* Overlay con efecto de gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-800 truncate group-hover:text-green-600 transition-colors duration-300">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm h-12 overflow-hidden mt-1">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="text-xl font-bold text-green-600">
                ${formatPrice(product.price)}
              </span>
              <div
                className={`p-2 rounded-full ${
                  product.stock > 0
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <ShoppingCart size={18} />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
