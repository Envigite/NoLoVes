"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  Search,
  ShoppingCart,
  X,
  Eye,
  Star,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  Tag,
  Sparkles,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import SearchAutocomplete from "@/components/SearchAutocomplete";
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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cart = useCart();
  const queryParam = searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(queryParam || "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState("price-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterExpanded, setFilterExpanded] = useState({
    categories: true,
    price: true,
    stock: true,
    sort: true,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }

        const data = await response.json();
        // Filtrar solo productos visibles
        const visibleProducts = data.filter(
          (product: Product) => product.isVisible,
        );
        setProducts(visibleProducts);

        // Inicializar búsqueda con el parámetro de consulta si existe
        if (queryParam) {
          setSearchTerm(queryParam);
        }
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
  }, [queryParam]);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term),
      );
    }

    // Filtrar por categorías seleccionadas
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        product.categories.some((cat) => selectedCategories.includes(cat)),
      );
    }

    // Filtrar por rango de precio
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Filtrar por stock
    if (inStockOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    // Ordenar productos
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredProducts(result);
  }, [
    products,
    searchTerm,
    selectedCategories,
    priceRange,
    inStockOnly,
    sortOption,
  ]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  // Manejar búsqueda desde el componente de autocompletado
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    // Actualizar la URL sin recargar la página
    const newUrl = query
      ? `/productos?q=${encodeURIComponent(query)}`
      : "/productos";
    window.history.pushState({}, "", newUrl);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([0, 1000000]);
    setInStockOnly(false);
    setSortOption("price-asc");
  };

  // Formatear precio como pesos chilenos sin decimales
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
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

  // Función para obtener icono de categoría
  const getCategoryIcon = (index: number) => {
    const icons = [
      <Eye key="eye" size={18} />,
      <Clock key="clock" size={18} />,
      <TrendingUp key="trending" size={18} />,
      <Star key="star" size={18} />,
      <Filter key="filter" size={18} />,
    ];
    return icons[index % icons.length];
  };

  // Función para alternar secciones de filtro
  const toggleFilterSection = (section: keyof typeof filterExpanded) => {
    setFilterExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Manejar añadir al carrito
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();

    if (product.stock <= 0) return;

    setIsAddingToCart(product._id);

    // Añadir al carrito
    cart.addToCart(product, 1);

    // Mostrar mensaje de éxito durante 1.5 segundos
    setTimeout(() => {
      setIsAddingToCart(null);
    }, 1500);
  };

  // Verificar si el producto ya está en el carrito
  const isInCart = (productId: string) => {
    return cart.items.some((item) => item.product._id === productId);
  };

  // Ir al carrito
  const goToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="bg-gradient-to-r from-green-600 to-emerald-800 text-white p-8 rounded-lg mb-8 shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
          <Sparkles className="mr-3" size={32} />
          Todos los Productos
        </h1>
        <p className="text-green-100 max-w-2xl">
          Explora nuestra colección de productos invisibles. Filtra por
          categoría, precio o disponibilidad para encontrar exactamente lo que
          estás buscando.
        </p>
      </div>

      {/* Barra de búsqueda principal con autocompletado */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <SearchAutocomplete
            onSearch={handleSearch}
            placeholder="Buscar productos invisibles..."
            className="w-full"
          />
        </div>

        {/* Filtros activos y visualización */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((catId, index) => {
              const category = CATEGORIES.find((c) => c.id === catId);
              return (
                <div
                  key={catId}
                  className={`bg-gradient-to-r ${getCategoryColor(index)} text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm transform transition-transform hover:scale-105`}
                >
                  <span>{category?.name || catId}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryToggle(catId);
                    }}
                    className="text-white hover:text-gray-200 ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}

            {searchTerm && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Search size={14} className="mr-1" />
                <span>{searchTerm}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearch("");
                  }}
                  className="text-white hover:text-gray-200 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {inStockOnly && (
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Check size={14} className="mr-1" />
                <span>En stock</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInStockOnly(false);
                  }}
                  className="text-white hover:text-gray-200 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Tag size={14} className="mr-1" />
                <span>
                  ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriceRange([0, 1000000]);
                  }}
                  className="text-white hover:text-gray-200 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {(selectedCategories.length > 0 ||
              searchTerm ||
              inStockOnly ||
              priceRange[0] > 0 ||
              priceRange[1] < 1000000) && (
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-green-700 font-medium px-3 py-1 rounded-full border border-gray-300 hover:border-green-500 transition-all duration-200 flex items-center"
              >
                <X size={14} className="mr-1" />
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-green-100 text-green-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-green-100 text-green-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="ml-2 md:hidden flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>{filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filtros para pantallas grandes */}
        <div
          className={`${filtersOpen ? "block" : "hidden"} md:block w-full md:w-64 bg-white rounded-lg shadow-md h-fit overflow-hidden transition-all duration-300`}
        >
          <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <h2 className="text-lg font-medium flex items-center">
              <Filter size={18} className="mr-2" />
              Filtros
            </h2>
          </div>

          <div className="p-4">
            <div className="mb-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilterSection("categories")}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <Tag size={16} className="mr-2 text-green-500" />
                  Categorías
                </h2>
                {filterExpanded.categories ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </div>

              <div
                className={`mt-3 space-y-2 overflow-hidden transition-all duration-300 ${filterExpanded.categories ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                {CATEGORIES.map((category, index) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleCategoryToggle(category.id);
                      }}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-gray-700 flex items-center"
                    >
                      {getCategoryIcon(index)}
                      <span className="ml-2">{category.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilterSection("price")}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <Tag size={16} className="mr-2 text-green-500" />
                  Precio
                </h2>
                {filterExpanded.price ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </div>

              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${filterExpanded.price ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => {
                      e.stopPropagation();
                      setPriceRange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ]);
                    }}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => {
                      e.stopPropagation();
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) || 0,
                      ]);
                    }}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div className="mt-4 px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={priceRange[0]}
                    onChange={(e) => {
                      e.stopPropagation();
                      setPriceRange([parseInt(e.target.value), priceRange[1]]);
                    }}
                    className="w-full accent-green-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      e.stopPropagation();
                      setPriceRange([priceRange[0], parseInt(e.target.value)]);
                    }}
                    className="w-full accent-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilterSection("stock")}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  Disponibilidad
                </h2>
                {filterExpanded.stock ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </div>

              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${filterExpanded.stock ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="stock-filter"
                    checked={inStockOnly}
                    onChange={(e) => {
                      e.stopPropagation();
                      setInStockOnly(!inStockOnly);
                    }}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                  />
                  <label htmlFor="stock-filter" className="ml-2 text-gray-700">
                    Sólo productos en stock
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleFilterSection("sort")}
              >
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <SlidersHorizontal
                    size={16}
                    className="mr-2 text-green-500"
                  />
                  Ordenar por
                </h2>
                {filterExpanded.sort ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </div>

              <div
                className={`mt-3 overflow-hidden transition-all duration-300 ${filterExpanded.sort ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <select
                  value={sortOption}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSortOption(e.target.value);
                  }}
                  className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                </select>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1">
          {/* Resultados */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"></div>
                <div
                  className="h-16 w-16 rounded-full border-r-4 border-l-4 border-green-300 animate-spin absolute top-0 left-0"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1s",
                  }}
                ></div>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg shadow-inner">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Eye size={48} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-medium text-gray-600 mb-2">
                No hay productos disponibles
              </h2>
              <p className="text-gray-500 mb-6">
                No se encontraron productos que coincidan con los criterios de
                búsqueda.
              </p>
              <button
                onClick={clearFilters}
                className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-gray-600 flex items-center font-medium">
                <Tag size={18} className="mr-2 text-green-500" />
                {filteredProducts.length} productos encontrados
              </p>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
                      onClick={() => router.push(`/productos/${product._id}`)}
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={product.imageUrl || "/images/placeholder.jpg"}
                          alt={product.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                        {product.stock <= 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md z-10">
                            Agotado
                          </div>
                        )}

                        {/* Overlay con efecto de gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Categorías con animación - Limitadas a 3 máximo */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                          <div className="flex flex-wrap gap-1">
                            {product.categories
                              .slice(0, 3)
                              .map((catId, idx) => {
                                const category = CATEGORIES.find(
                                  (c) => c.id === catId,
                                );
                                return (
                                  <span
                                    key={`${product._id}-cat-${idx}`}
                                    className={`bg-gradient-to-r ${getCategoryColor(idx)} text-white text-xs px-2 py-1 rounded-full shadow-sm flex items-center`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/productos/categoria/${catId}`,
                                      );
                                    }}
                                  >
                                    {getCategoryIcon(idx)}
                                    <span className="ml-1">
                                      {category?.name || catId}
                                    </span>
                                  </span>
                                );
                              })}
                            {product.categories.length > 3 && (
                              <span className="text-white text-xs bg-gray-700/80 px-2 py-1 rounded-full">
                                +{product.categories.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-800 truncate group-hover:text-green-600 transition-colors duration-300">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm h-12 overflow-hidden mt-1">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">
                              Precio
                            </span>
                            <span className="text-xl font-bold text-green-600 flex items-center">
                              <Tag size={14} className="mr-1" />$
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          {isInCart(product._id) ? (
                            <button
                              className="p-3 rounded-full shadow-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-md hover:scale-110"
                              onClick={(e) => goToCart(e)}
                            >
                              <ShoppingCart size={18} />
                            </button>
                          ) : (
                            <button
                              className={`p-3 rounded-full shadow-sm transition-all duration-300 ${
                                product.stock > 0
                                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-md hover:scale-110"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              } relative overflow-hidden`}
                              disabled={product.stock <= 0}
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              {isAddingToCart === product._id ? (
                                <Check size={18} />
                              ) : (
                                <ShoppingCart size={18} />
                              )}

                              {/* Animación al añadir al carrito */}
                              <span
                                className={`absolute inset-0 flex items-center justify-center bg-green-600 text-white transition-transform duration-300 ${
                                  isAddingToCart === product._id
                                    ? "translate-y-0"
                                    : "translate-y-full"
                                }`}
                              >
                                <Check size={18} />
                              </span>
                            </button>
                          )}
                        </div>

                        {product.stock > 0 && (
                          <div className="mt-3 flex items-center">
                            <div className="bg-green-100 h-2 rounded-full flex-grow">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                                style={{
                                  width: `${Math.min(100, (product.stock / 10) * 100)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              {product.stock} en stock
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-green-500 group flex flex-col md:flex-row cursor-pointer"
                      onClick={() => router.push(`/productos/${product._id}`)}
                    >
                      <div className="w-full md:w-1/4 h-48 md:h-auto overflow-hidden relative">
                        <img
                          src={product.imageUrl || "/images/placeholder.jpg"}
                          alt={product.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                        {product.stock <= 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                            Agotado
                          </div>
                        )}
                      </div>

                      <div className="w-full md:w-3/4 p-4 md:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.categories
                              .slice(0, 5)
                              .map((catId, idx) => {
                                const category = CATEGORIES.find(
                                  (c) => c.id === catId,
                                );
                                return (
                                  <span
                                    key={`${product._id}-list-cat-${idx}`}
                                    className={`bg-gradient-to-r ${getCategoryColor(
                                      idx,
                                    )} text-white text-xs px-2 py-1 rounded-full flex items-center`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(
                                        `/productos/categoria/${catId}`,
                                      );
                                    }}
                                  >
                                    {getCategoryIcon(idx)}
                                    <span className="ml-1">
                                      {category?.name || catId}
                                    </span>
                                  </span>
                                );
                              })}
                            {product.categories.length > 5 && (
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                +{product.categories.length - 5}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                            {product.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-green-600 mr-2">
                              ${formatPrice(product.price)}
                            </span>
                            {product.stock > 0 ? (
                              <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                En stock ({product.stock})
                              </span>
                            ) : (
                              <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                Agotado
                              </span>
                            )}
                          </div>

                          {isInCart(product._id) ? (
                            <button
                              className="mt-2 sm:mt-0 px-4 py-2 rounded-md shadow-sm transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-md flex items-center"
                              onClick={(e) => goToCart(e)}
                            >
                              <ShoppingCart size={18} className="mr-2" />
                              <span>Ver carrito</span>
                            </button>
                          ) : (
                            <button
                              className={`mt-2 sm:mt-0 px-4 py-2 rounded-md shadow-sm transition-all duration-300 ${
                                product.stock > 0
                                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-md"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              } flex items-center relative overflow-hidden`}
                              disabled={product.stock <= 0}
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              <div
                                className={`flex items-center transition-opacity duration-300 ${
                                  isAddingToCart === product._id
                                    ? "opacity-0"
                                    : "opacity-100"
                                }`}
                              >
                                <ShoppingCart size={18} className="mr-2" />
                                <span>Añadir al carrito</span>
                              </div>

                              <div
                                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
                                  isAddingToCart === product._id
                                    ? "translate-y-0"
                                    : "translate-y-full"
                                }`}
                              >
                                <Check size={18} className="mr-2" />
                                <span>¡Añadido!</span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
