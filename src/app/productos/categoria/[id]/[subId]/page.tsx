"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

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

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const subcategoryId = params.subId as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Encontrar la categoría actual
  const currentCategory = CATEGORIES.find((cat) => cat.id === categoryId);

  // Encontrar subcategoría
  const currentSubcategory = currentCategory?.subcategories.find(
    (sub) => sub.id === subcategoryId,
  );

  // Título de la página
  const pageTitle = currentSubcategory
    ? `${currentCategory?.name} - ${currentSubcategory.name}`
    : "Subcategoría";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Obtener todos los productos
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }

        const allProducts = await response.json();

        // Filtrar productos por subcategoría
        const filteredProducts = allProducts.filter((product: Product) =>
          product.subcategories.includes(`${categoryId}-${subcategoryId}`),
        );

        // Ordenar productos por precio ascendente
        filteredProducts.sort((a: Product, b: Product) => a.price - b.price);

        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError(
          "No se pudieron cargar los productos. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subcategoryId]);

  // Formatear precio como pesos chilenos sin decimales
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col items-start mb-8">
        <Link
          href={`/productos/categoria/${categoryId}`}
          className="flex items-center text-gray-600 hover:text-green-500 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Volver a {currentCategory?.name || "categoría"}</span>
        </Link>

        <h1 className="text-3xl font-bold">{pageTitle}</h1>

        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mt-2">
          <Link href="/" className="hover:text-green-500">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/productos" className="hover:text-green-500">
            Productos
          </Link>
          {currentCategory && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/productos/categoria/${categoryId}`}
                className="hover:text-green-500"
              >
                {currentCategory.name}
              </Link>
            </>
          )}
          {currentSubcategory && (
            <>
              <span className="mx-2">/</span>
              <span className="text-gray-700 font-medium">
                {currentSubcategory.name}
              </span>
            </>
          )}
        </nav>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No hay productos disponibles
          </h2>
          <p className="text-gray-500 mb-6">
            No se encontraron productos en esta subcategoría.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(`/productos/${product._id}`)}
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={product.imageUrl || "/images/placeholder.jpg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/placeholder.jpg";
                  }}
                />
                {product.stock <= 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
                    Agotado
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-800 truncate">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm h-12 overflow-hidden">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-green-600">
                    ${formatPrice(product.price)}
                  </span>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                    disabled={product.stock <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Agregar al carrito
                      alert("Producto agregado al carrito");
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
