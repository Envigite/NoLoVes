"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ShoppingCart,
  Star,
  Tag,
  Eye,
  Clock,
  Check,
  AlertTriangle,
} from "lucide-react";
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Producto no encontrado");
          }
          throw new Error("Error al cargar el producto");
        }

        const data = await response.json();
        setProduct(data);

        // Cargar productos relacionados (mismas categorías)
        const allProductsResponse = await fetch("/api/products");
        if (allProductsResponse.ok) {
          const allProducts = await allProductsResponse.json();

          // Filtrar productos de la misma categoría, excluyendo el actual
          const related = allProducts
            .filter(
              (p: Product) =>
                p._id !== productId &&
                p.isVisible &&
                p.categories.some((cat) => data.categories.includes(cat)),
            )
            .slice(0, 4);

          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Formatear precio como pesos chilenos sin decimales
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  // Obtener nombre de categoría
  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  // Obtener nombre de subcategoría
  const getSubcategoryName = (fullSubcategoryId: string) => {
    const [categoryId, subcategoryId] = fullSubcategoryId.split("-");
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    const subcategory = category?.subcategories.find(
      (sub) => sub.id === subcategoryId,
    );
    return subcategory?.name || subcategoryId;
  };

  // Función para obtener color de categoría
  const getCategoryColor = (index: number) => {
    const colors = [
      "from-green-500 to-emerald-700",
      "from-blue-500 to-indigo-700",
      "from-purple-500 to-purple-800",
      "from-pink-500 to-rose-700",
      "from-yellow-500 to-amber-700",
      "from-red-500 to-red-800",
      "from-indigo-500 to-blue-800",
      "from-teal-500 to-teal-800",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"></div>
            <div
              className="h-16 w-16 rounded-full border-r-4 border-l-4 border-green-300 animate-spin absolute top-0 left-0"
              style={{ animationDirection: "reverse", animationDuration: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <AlertTriangle size={24} className="text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-red-700">{error}</h2>
          </div>
          <p className="mt-3 text-gray-600">
            Lo sentimos, no pudimos encontrar el producto que estás buscando.
          </p>
          <div className="mt-6">
            <Link
              href="/productos"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              <ChevronLeft size={16} className="mr-2" /> Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Navegación y breadcrumbs */}
      <div className="mb-6">
        <Link
          href="/productos"
          className="inline-flex items-center text-gray-600 hover:text-green-500 mb-4"
        >
          <ChevronLeft size={16} className="mr-1" />
          <span>Volver a productos</span>
        </Link>

        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-green-500">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/productos" className="hover:text-green-500">
            Productos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{product.title}</span>
        </nav>
      </div>

      {/* Detalles del producto */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
        <div className="md:flex">
          {/* Imagen del producto */}
          <div className="md:w-1/2 h-72 md:h-auto relative">
            <img
              src={product.imageUrl || "/images/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
              }}
            />
            {product.stock <= 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-medium">
                Agotado
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {product.title}
            </h1>

            {/* Categorías */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.categories.map((categoryId, idx) => (
                <Link
                  href={`/productos/categoria/${categoryId}`}
                  key={categoryId}
                  className={`bg-gradient-to-r ${getCategoryColor(idx)} text-white text-sm px-3 py-1 rounded-full transition-transform hover:scale-105 shadow-sm`}
                >
                  {getCategoryName(categoryId)}
                </Link>
              ))}
            </div>

            {/* Precio */}
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Precio</div>
              <div className="text-3xl font-bold text-green-600">
                ${formatPrice(product.price)}
              </div>
            </div>

            {/* Descripción */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2 text-gray-700">
                Descripción
              </h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Disponibilidad */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2 text-gray-700">
                Disponibilidad
              </h2>
              {product.stock > 0 ? (
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="bg-green-100 h-2 w-32 rounded-full">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (product.stock / 10) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-green-600 flex items-center">
                    <Check size={16} className="mr-1" />
                    {product.stock} en stock
                  </span>
                </div>
              ) : (
                <div className="text-red-500 flex items-center">
                  <AlertTriangle size={16} className="mr-1" />
                  Agotado
                </div>
              )}
            </div>

            {/* Botón de compra */}
            <button
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                product.stock > 0
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={product.stock <= 0}
            >
              <div className="flex justify-center items-center">
                <ShoppingCart size={20} className="mr-2" />
                Agregar al carrito
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Tag size={22} className="mr-2 text-green-500" />
            Productos relacionados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                href={`/productos/${relatedProduct._id}`}
                key={relatedProduct._id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={relatedProduct.imageUrl || "/images/placeholder.jpg"}
                    alt={relatedProduct.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder.jpg";
                    }}
                  />
                  {relatedProduct.stock <= 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Agotado
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 truncate group-hover:text-green-600 transition-colors duration-300">
                    {relatedProduct.title}
                  </h3>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-green-600">
                      ${formatPrice(relatedProduct.price)}
                    </span>
                    {relatedProduct.stock > 0 ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        En stock
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        Agotado
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
