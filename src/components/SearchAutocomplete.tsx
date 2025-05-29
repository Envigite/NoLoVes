"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Tag, Eye, X, ArrowRight } from "lucide-react";
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

interface SearchSuggestion {
  type: "product" | "category" | "subcategory" | "query";
  id: string;
  title: string;
  imageUrl?: string;
  categoryId?: string;
  subcategoryId?: string;
  price?: number;
}

interface SearchAutocompleteProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  maxSuggestions?: number;
  darkMode?: boolean;
}

const SearchAutocomplete = ({
  onSearch,
  placeholder = "Buscar productos invisibles...",
  className = "",
  maxSuggestions = 6,
  darkMode = false,
}: SearchAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hasFocus, setHasFocus] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch (e) {
        console.error("Error parsing recent searches:", e);
      }
    }
  }, []);

  // Cargar todos los productos cuando se monta el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Error al cargar productos");
        }
        const data = await response.json();
        setAllProducts(data.filter((product: Product) => product.isVisible));
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Manejar clics fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generar sugerencias basadas en el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Si no hay término de búsqueda, mostrar búsquedas recientes
      const recentSearchSuggestions: SearchSuggestion[] = recentSearches.map(
        (term) => ({
          type: "query",
          id: `recent-${term}`,
          title: term,
        }),
      );
      setSuggestions(recentSearchSuggestions);
      return;
    }

    setIsLoading(true);

    // Filtrar productos que coincidan con el término de búsqueda
    const productMatches = allProducts
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((product) => ({
        type: "product" as const,
        id: product._id,
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
      }))
      .slice(0, maxSuggestions - 2);

    // Filtrar categorías que coincidan con el término de búsqueda
    const categoryMatches = CATEGORIES.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
      .map((category) => ({
        type: "category" as const,
        id: category.id,
        title: category.name,
      }))
      .slice(0, 2);

    // Filtrar subcategorías que coincidan con el término de búsqueda
    const subcategoryMatches: SearchSuggestion[] = [];
    CATEGORIES.forEach((category) => {
      category.subcategories
        .filter((subcat) =>
          subcat.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 2)
        .forEach((subcat) => {
          subcategoryMatches.push({
            type: "subcategory",
            id: `${category.id}-${subcat.id}`,
            title: subcat.name,
            categoryId: category.id,
            subcategoryId: subcat.id,
          });
        });
    });

    // Si no hay coincidencias exactas, agregar la consulta actual como sugerencia
    const allSuggestions = [
      ...productMatches,
      ...categoryMatches,
      ...subcategoryMatches.slice(0, 2),
    ];

    if (allSuggestions.length === 0) {
      allSuggestions.push({
        type: "query",
        id: `query-${searchTerm}`,
        title: searchTerm,
      });
    }

    setSuggestions(allSuggestions.slice(0, maxSuggestions));
    setIsLoading(false);
  }, [searchTerm, allProducts, maxSuggestions, recentSearches]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputFocus = () => {
    setHasFocus(true);
    setShowSuggestions(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      // Guardar en búsquedas recientes
      const updatedSearches = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);

      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

      // Realizar la búsqueda
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        router.push(`/productos?q=${encodeURIComponent(searchTerm)}`);
      }

      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case "product":
        router.push(`/productos/${suggestion.id}`);
        break;
      case "category":
        router.push(`/productos/categoria/${suggestion.id}`);
        break;
      case "subcategory":
        if (suggestion.categoryId && suggestion.subcategoryId) {
          router.push(
            `/productos/categoria/${suggestion.categoryId}/${suggestion.subcategoryId}`,
          );
        }
        break;
      case "query":
        setSearchTerm(suggestion.title);
        handleSearch(new Event("submit") as unknown as React.FormEvent);
        break;
    }

    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  // Formatear precio
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-CL");
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`w-full py-3 px-5 pr-12 rounded-full border ${hasFocus ? "border-green-500 ring-2 ring-green-200" : "border-gray-300"} focus:outline-none transition-all duration-200 ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-800"}`}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className={`mr-2 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className={`${darkMode ? "text-gray-300 hover:text-white" : "text-gray-400 hover:text-green-500"} transition-colors`}
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {/* Sugerencias */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className={`absolute z-50 top-full left-0 right-0 mt-2 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {isLoading ? (
            <div
              className={`p-4 text-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              <div className="animate-pulse flex justify-center">
                <div className="h-5 w-5 bg-green-500 rounded-full animate-bounce"></div>
                <div
                  className="h-5 w-5 bg-green-500 rounded-full animate-bounce mx-2"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="h-5 w-5 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
              <p className="mt-2">Buscando sugerencias...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {recentSearches.length > 0 && !searchTerm && (
                <div
                  className={`px-3 py-2 text-xs font-medium ${darkMode ? "text-gray-400 bg-gray-700" : "text-gray-500 bg-gray-50"}`}
                >
                  Búsquedas recientes
                </div>
              )}

              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`px-4 py-2 cursor-pointer transition-colors flex items-center ${
                    darkMode
                      ? "hover:bg-gray-700 border-b border-gray-700"
                      : "hover:bg-gray-50 border-b border-gray-100"
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.type === "product" && (
                    <>
                      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 mr-3 bg-gray-100">
                        <img
                          src={suggestion.imageUrl || "/images/placeholder.jpg"}
                          alt={suggestion.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div
                          className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {suggestion.title}
                        </div>
                        {suggestion.price !== undefined && (
                          <div
                            className={`text-sm ${darkMode ? "text-green-400" : "text-green-600"}`}
                          >
                            ${formatPrice(suggestion.price)}
                          </div>
                        )}
                      </div>
                      <ArrowRight
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-400"}
                      />
                    </>
                  )}

                  {suggestion.type === "category" && (
                    <>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${darkMode ? "bg-green-700" : "bg-green-100"}`}
                      >
                        <Tag
                          size={16}
                          className={
                            darkMode ? "text-green-300" : "text-green-600"
                          }
                        />
                      </div>
                      <div className="flex-grow">
                        <div
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {suggestion.title}
                        </div>
                        <div
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Categoría
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-400"}
                      />
                    </>
                  )}

                  {suggestion.type === "subcategory" && (
                    <>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${darkMode ? "bg-blue-700" : "bg-blue-100"}`}
                      >
                        <Tag
                          size={16}
                          className={
                            darkMode ? "text-blue-300" : "text-blue-600"
                          }
                        />
                      </div>
                      <div className="flex-grow">
                        <div
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {suggestion.title}
                        </div>
                        <div
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Subcategoría
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-400"}
                      />
                    </>
                  )}

                  {suggestion.type === "query" && (
                    <>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                      >
                        <Search
                          size={16}
                          className={
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }
                        />
                      </div>
                      <div className="flex-grow">
                        <div
                          className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                        >
                          {suggestion.title}
                        </div>
                      </div>
                      <ArrowRight
                        size={16}
                        className={darkMode ? "text-gray-400" : "text-gray-400"}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            <div
              className={`p-4 text-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              <Eye size={24} className="mx-auto mb-2 opacity-50" />
              <p>No se encontraron resultados para "{searchTerm}"</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
