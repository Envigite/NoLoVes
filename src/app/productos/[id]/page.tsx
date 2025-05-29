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
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import { useCart } from "@/context/CartContext";

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
  const cart = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

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

  // Manejar cambio de cantidad
  const handleQuantityChange = (value: number) => {
    if (product) {
      // Asegurarse de que la cantidad esté entre 1 y el stock disponible
      const newQuantity = Math.max(1, Math.min(value, product.stock));
      setQuantity(newQuantity);
    }
  };

  // Manejar añadir al carrito
  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      setIsAddingToCart(true);

      // Añadir al carrito
      cart.addToCart(product, quantity);

      // Mostrar mensaje de éxito
      setShowAddedMessage(true);

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setShowAddedMessage(false);
        setIsAddingToCart(false);
      }, 3000);
    }
  };

  // Verificar si el producto ya está en el carrito
  const isInCart = () => {
    return product
      ? cart.items.some((item) => item.product._id === product._id)
      : false;
  };

  // Ir al carrito
  const goToCart = () => {
    router.push("/cart");
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
              <div className="flex items-center">
                {product.stock > 0 ? (
                  <>
                    <Check size={18} className="text-green-500 mr-2" />
                    <span className="text-green-600">
                      {product.stock > 10
                        ? "En stock"
                        : `¡Solo quedan ${product.stock} unidades!`}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} className="text-red-500 mr-2" />
                    <span className="text-red-600">Agotado</span>
                  </>
                )}
              </div>
            </div>

            {/* Añadir al carrito */}
            <div className="mt-8">
              {product.stock > 0 ? (
                <div className="space-y-4">
                  {/* Control de cantidad */}
                  <div className="flex items-center">
                    <span className="mr-4 text-gray-700">Cantidad:</span>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 min-w-[40px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-2">
                    {isInCart() ? (
                      <button
                        onClick={goToCart}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center"
                      >
                        <ShoppingCart size={18} className="mr-2" />
                        <span>Ir al carrito</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center relative overflow-hidden"
                      >
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-green-600 transition-transform duration-300 ${
                            showAddedMessage
                              ? "translate-y-0"
                              : "translate-y-full"
                          }`}
                        >
                          <Check size={24} className="mr-2" />
                          <span>¡Añadido!</span>
                        </div>
                        <div
                          className={`flex items-center justify-center transition-opacity duration-300 ${
                            showAddedMessage ? "opacity-0" : "opacity-100"
                          }`}
                        >
                          <ShoppingBag size={18} className="mr-2" />
                          <span>Añadir al carrito</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-md cursor-not-allowed flex items-center justify-center"
                >
                  <AlertTriangle size={18} className="mr-2" />
                  <span>Producto agotado</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subcategorías */}
      {product.subcategories.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Subcategorías
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.subcategories.map((subcategoryId) => (
              <Link
                href={`/productos/categoria/${subcategoryId.split("-")[0]}/${subcategoryId.split("-")[1]}`}
                key={subcategoryId}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full transition-colors"
              >
                {getSubcategoryName(subcategoryId)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Productos relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                href={`/productos/${relatedProduct._id}`}
                key={relatedProduct._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={relatedProduct.imageUrl || "/images/placeholder.jpg"}
                    alt={relatedProduct.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/images/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2 line-clamp-2">
                    {relatedProduct.title}
                  </h3>
                  <div className="text-green-600 font-bold">
                    ${formatPrice(relatedProduct.price)}
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
