"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Filter,
  Eye,
  Clock,
  TrendingUp,
  Star,
  Tag,
  Grid,
  LayoutGrid,
} from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import SearchAutocomplete from "./SearchAutocomplete";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const cart = useCart();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Efecto para manejar clics fuera del navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
        setSelectedCategory(null);
        setUserMenuOpen(false);
        setFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cerrar menú móvil en redimensionamiento
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Enfocar el input de búsqueda cuando se abre
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Funciones de toggle
  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
    if (filtersOpen) setFiltersOpen(false);
  };

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
    if (categoriesOpen) setCategoriesOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
    // Redirigir a la página de productos con el término de búsqueda
    if (query.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(query)}`;
    }
    // Cerrar el menú de búsqueda en móvil
    setSearchOpen(false);
  };

  // Función para generar URL de categoría
  const getCategoryUrl = (categoryId: string) => {
    return `/productos/categoria/${categoryId}`;
  };

  // Función para generar URL de subcategoría
  const getSubcategoryUrl = (categoryId: string, subcategoryId: string) => {
    return `/productos/categoria/${categoryId}/${subcategoryId}`;
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

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 shadow-md bg-gradient-to-r from-white via-white to-green-50"
      ref={navbarRef}
    >
      {/* Overlay para fondos oscuros cuando los menús están abiertos */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          categoriesOpen || mobileMenuOpen || filtersOpen
            ? "opacity-50"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setCategoriesOpen(false);
          setSelectedCategory(null);
          setMobileMenuOpen(false);
          setFiltersOpen(false);
        }}
      />

      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y botón de menú móvil */}
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-gray-600 hover:text-green-500 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link
              href="/"
              className="h-10 w-32 flex-shrink-0 flex items-center"
            >
              <img
                src="/images/ojo-verde.png"
                alt="NoLoVes Logo"
                className="h-full w-auto object-contain"
              />
              <span className="ml-2 font-bold text-xl text-green-600">
                NoLoVes
              </span>
            </Link>
          </div>

          {/* Barra de búsqueda central (escritorio) con autocompletado */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            <SearchAutocomplete
              onSearch={handleSearch}
              className="w-full max-w-xl"
            />
          </div>

          {/* Navegación y botones de acción (escritorio) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="flex items-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-200 px-4 py-2 rounded-md group font-medium"
              onClick={toggleCategories}
            >
              <LayoutGrid
                size={18}
                className="mr-2 transition-transform duration-300 group-hover:rotate-90"
              />
              <span>Categorías</span>
              <span
                className={`ml-1 w-2 h-2 rounded-full bg-green-500 transition-transform duration-300 ${categoriesOpen ? "scale-150 bg-white" : "scale-100"}`}
              ></span>
            </button>

            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-200 px-3 py-2 rounded-md font-medium"
            >
              Admin
            </Link>

            {/* Carrito de compras */}
            <div className="relative">
              <Link
                href="/cart"
                className="flex items-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 transition-all duration-200 px-3 py-2 rounded-md font-medium"
              >
                <ShoppingCart size={20} className="mr-2" />
                <span>Carrito</span>
                {cart.getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.getCartCount()}
                  </span>
                )}
              </Link>
            </div>

            <div className="relative">
              <button
                className="flex items-center text-gray-600 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-50"
                onClick={toggleUserMenu}
                aria-label="Usuario"
              >
                <User size={20} />
              </button>

              {/* Menú de usuario */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transform origin-top-right transition-all duration-200 ${
                  userMenuOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Link
                  href="/perfil"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                >
                  Mi perfil
                </Link>
                <Link
                  href="/pedidos"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                >
                  Mis pedidos
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                >
                  Cerrar sesión
                </Link>
              </div>
            </div>
          </div>

          {/* Botones de acción móvil */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              className="p-2 text-gray-600 hover:text-green-500 transition-colors rounded-full hover:bg-green-50"
              onClick={toggleSearch}
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* Carrito móvil */}
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-green-500 transition-colors rounded-full hover:bg-green-50 relative"
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {cart.getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.getCartCount()}
                </span>
              )}
            </Link>

            <button
              className="p-2 text-gray-600 hover:text-green-500 transition-colors rounded-full hover:bg-green-50"
              onClick={toggleUserMenu}
              aria-label="Usuario"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda móvil con autocompletado */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          searchOpen ? "h-14 pb-4" : "h-0"
        }`}
      >
        <SearchAutocomplete onSearch={handleSearch} className="w-full" />
      </div>

      {/* Menú de categorías desplegable (escritorio) */}
      <div
        ref={categoriesRef}
        className={`absolute left-0 w-full bg-white shadow-xl z-50 transition-all duration-300 ${
          categoriesOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{
          maxHeight: categoriesOpen ? "80vh" : "0",
          overflowY: categoriesOpen ? "auto" : "hidden",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-5 gap-6">
            {/* Lista de categorías principales con animación y colores */}
            <div className="col-span-1 border-r pr-4">
              <h3 className="font-medium text-lg mb-4 text-gray-800 flex items-center">
                <Eye size={20} className="mr-2 text-green-500" />
                Categorías
              </h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 categories-scrollbar">
                {CATEGORIES.map((category, index) => (
                  <div key={category.id} className="mb-2">
                    <button
                      className={`text-left w-full py-2 px-3 rounded-md transition-all duration-200 relative overflow-hidden group ${
                        selectedCategory === category.id
                          ? "text-white font-medium"
                          : "text-gray-700 hover:text-white"
                      }`}
                      onMouseEnter={() => setSelectedCategory(category.id)}
                      onClick={() => {
                        // Cerrar el menú y navegar a la categoría
                        setCategoriesOpen(false);
                        window.location.href = getCategoryUrl(category.id);
                      }}
                    >
                      <span className="relative z-10 flex items-center">
                        {getCategoryIcon(index)}
                        <span className="ml-2">{category.name}</span>
                      </span>
                      <span
                        className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(index)} transform transition-transform duration-300 
                          ${selectedCategory === category.id ? "translate-x-0" : "-translate-x-full"} 
                          group-hover:translate-x-0`}
                      ></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subcategorías de la categoría seleccionada con animaciones */}
            <div className="col-span-4 pl-4">
              {selectedCategory ? (
                <>
                  <h3 className="font-medium text-xl mb-4 text-gray-800 border-b pb-2">
                    {
                      CATEGORIES.find((cat) => cat.id === selectedCategory)
                        ?.name
                    }
                  </h3>
                  <div className="grid grid-cols-3 gap-y-3 gap-x-6">
                    {CATEGORIES.find(
                      (cat) => cat.id === selectedCategory,
                    )?.subcategories.map((subcat, idx) => (
                      <Link
                        key={subcat.id}
                        href={getSubcategoryUrl(selectedCategory, subcat.id)}
                        className="group"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        <div className="block p-3 rounded-md text-gray-700 hover:bg-gray-50 hover:text-green-500 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md">
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors duration-200">
                              {idx + 1}
                            </span>
                            <span className="font-medium">{subcat.name}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Eye size={48} className="text-green-400 mb-3" />
                  <p className="text-lg mb-1">Explora nuestras categorías</p>
                  <p className="text-sm text-gray-400">
                    Selecciona una categoría para ver sus subcategorías
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full w-4/5 max-w-sm bg-gradient-to-b from-white to-green-50 shadow-xl overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/images/ojo-verde.png"
                alt="NoLoVes Logo"
                className="h-10 w-auto"
              />
              <span className="ml-2 font-bold text-xl text-green-600">
                NoLoVes
              </span>
            </div>
            <button
              className="text-gray-600 hover:text-red-500 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4">
            <button
              className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white rounded-md transition-all duration-200 group font-medium"
              onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
            >
              <span className="flex items-center">
                <LayoutGrid
                  size={18}
                  className="mr-2 text-green-500 group-hover:text-white transition-transform duration-300 group-hover:rotate-90"
                />
                Categorías
              </span>
              <span
                className={`w-2 h-2 rounded-full ${mobileCategoriesOpen ? "bg-white scale-150" : "bg-green-500 scale-100"} transition-all duration-300`}
              ></span>
            </button>

            <div
              className={`mt-2 ml-4 transition-all duration-300 ease-in-out overflow-hidden ${
                mobileCategoriesOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {CATEGORIES.map((category, index) => (
                <div key={category.id} className="mb-2">
                  <button
                    className="flex items-center justify-between w-full py-2 px-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 rounded-md group"
                    onClick={() =>
                      setMobileSelectedCategory(
                        mobileSelectedCategory === category.id
                          ? null
                          : category.id,
                      )
                    }
                  >
                    <span className="flex items-center">
                      {getCategoryIcon(index)}
                      <span className="ml-2">{category.name}</span>
                    </span>
                    {mobileSelectedCategory === category.id ? (
                      <ChevronDown
                        size={16}
                        className="transform transition-transform duration-300 group-hover:rotate-180"
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        className="transform transition-transform duration-300 group-hover:rotate-90"
                      />
                    )}
                  </button>

                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      mobileSelectedCategory === category.id
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {category.subcategories.map((subcategory, subIdx) => (
                      <Link
                        key={subcategory.id}
                        href={getSubcategoryUrl(category.id, subcategory.id)}
                        className="block py-2 px-3 text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-md"
                        onClick={toggleMobileMenu}
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 text-green-600 text-xs">
                            {subIdx + 1}
                          </span>
                          {subcategory.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <Link
              href="/productos"
              className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white rounded-md transition-all duration-200 font-medium"
              onClick={toggleMobileMenu}
            >
              <Eye size={16} className="mr-2" />
              Todos los productos
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white rounded-md transition-all duration-200 font-medium mt-2"
              onClick={toggleMobileMenu}
            >
              <User size={16} className="mr-2" />
              Admin
            </Link>

            <hr className="my-4" />

            <div className="space-y-2">
              <Link
                href="/perfil"
                className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={toggleMobileMenu}
              >
                <User size={16} className="mr-2 text-green-500" />
                Mi Perfil
              </Link>
              <Link
                href="/pedidos"
                className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={toggleMobileMenu}
              >
                <Clock size={16} className="mr-2 text-green-500" />
                Mis Pedidos
              </Link>
              <Link
                href="/auth/logout"
                className="flex items-center w-full py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={toggleMobileMenu}
              >
                <X size={16} className="mr-2 text-red-500" />
                Cerrar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        .categories-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .categories-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .categories-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .categories-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
