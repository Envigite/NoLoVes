"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState<
    number | null
  >(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    {
      name: "Herramientas",
      subcategories: [
        {
          name: "Herramientas Eléctricas",
          items: [
            "Esmeril invisible",
            "Taladro phantom",
            "Sierra cinta etérea",
          ],
        },
        {
          name: "Herramientas de Carpintería",
          items: [
            "Martillos invisibles",
            "Sierras de aire",
            "Cepillos volátiles",
          ],
        },
      ],
    },
    {
      name: "Jardinería",
      subcategories: [
        {
          name: "Equipos de Riego",
          items: [
            "Aspersor inteligente",
            "Manguera extensible",
            "Temporizador de agua",
          ],
        },
        {
          name: "Plantas y Semillas",
          items: [
            "Semillas orgánicas",
            "Plantas de interior",
            "Árboles frutales",
          ],
        },
      ],
    },
    {
      name: "Materiales",
      subcategories: [
        {
          name: "Materiales de Construcción",
          items: ["Cemento premium", "Ladrillos reforzados", "Madera tratada"],
        },
        {
          name: "Pinturas y Acabados",
          items: [
            "Pinturas ecológicas",
            "Barnices naturales",
            "Esmaltes decorativos",
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
        setSelectedCategory(null);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleCategories = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  const handleMobileCategoryClick = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setMobileSelectedCategory(mobileSelectedCategory === index ? null : index);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="h-10 w-32">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="./images/ojo-verde.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </a>
        </div>
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            categoriesOpen || mobileMenuOpen
              ? "opacity-50"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => {
            setCategoriesOpen(false);
            setSelectedCategory(null);
            setMobileMenuOpen(false);
          }}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center text-gray-600 hover:text-green-500 transition-colors duration-300"
              onClick={toggleCategories}
            >
              Categorías <ChevronDown size={16} className="ml-1" />
            </button>

            {/* Main dropdown with animation */}
            <div
              className={`absolute top-full left-0 mt-1 bg-white shadow-md rounded-md py-2 w-48 z-50 transition-all duration-300 origin-top ${
                categoriesOpen
                  ? "opacity-100 transform scale-y-100"
                  : "opacity-0 transform scale-y-0 pointer-events-none"
              }`}
            >
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setSelectedCategory(index)}
                  onMouseLeave={() => setSelectedCategory(null)}
                >
                  <button
                    className="flex w-full items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300"
                    onClick={toggleMobileCategories}
                  >
                    {category.name}
                    <ChevronRight size={14} className="ml-1" />
                  </button>

                  {/* Subcategory dropdown with animation */}
                  <div
                    className={`absolute top-0 left-full ml-1 bg-white shadow-md rounded-md py-2 w-64 z-50 transition-all duration-300 origin-left ${
                      selectedCategory === index
                        ? "opacity-100 transform scale-x-100"
                        : "opacity-0 transform scale-x-0 pointer-events-none"
                    }`}
                  >
                    {category.subcategories.map((subcategory, subIndex) => (
                      <div key={subIndex} className="px-4 py-2">
                        <div className="font-medium text-gray-800 border-b border-gray-200 pb-1 mb-2">
                          {subcategory.name}
                        </div>
                        <ul className="pl-2">
                          {subcategory.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <a
                                href="#"
                                className="block py-1 text-gray-600 hover:text-green-500 transition-colors duration-300"
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#"
            className="text-gray-600 hover:text-green-500 transition-colors duration-300"
          >
            Productos destacados
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-green-500 transition-colors duration-300"
          >
            Sobre Nosotros
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-green-500 transition-colors duration-300"
          >
            Contacto
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between w-full px-4">
          <button
            className="text-gray-600 hover:text-green-500 transition-colors duration-300"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Menú</h2>
            <button
              className="text-gray-600 hover:text-green-500 transition-colors duration-300"
              onClick={toggleMobileMenu}
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4">
            <div>
              <button
                className="flex w-full items-center justify-between py-3 text-gray-700 border-b"
                onClick={toggleMobileCategories}
              >
                <span>Categorías</span>
                {mobileCategoriesOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Mobile Categories Submenu */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  mobileCategoriesOpen
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {categories.map((category, index) => (
                  <div key={index}>
                    <button
                      className="flex w-full items-center justify-between py-2 pl-4 text-gray-700"
                      onClick={(e) => handleMobileCategoryClick(index, e)}
                    >
                      <span>{category.name}</span>
                      {mobileSelectedCategory === index ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>

                    {/* Mobile Subcategories - Overlays the categories list */}
                    <div
                      className={`transition-all duration-300 pl-8 overflow-hidden ${
                        mobileSelectedCategory === index
                          ? "max-h-screen opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {category.subcategories.map((subcategory, subIndex) => (
                        <div key={subIndex} className="py-2">
                          <div className="font-medium text-gray-800 mb-1">
                            {subcategory.name}
                          </div>
                          <ul>
                            {subcategory.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <a
                                  href="#"
                                  className="block py-1 text-gray-600"
                                >
                                  {item}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a href="#" className="block py-3 text-gray-700 border-b">
              Productos destacados
            </a>
            <a href="#" className="block py-3 text-gray-700 border-b">
              Sobre Nosotros
            </a>
            <a href="#" className="block py-3 text-gray-700 border-b">
              Contacto
            </a>
          </div>
        </div>

        <div className="flex space-x-4">
          <div>
            <button
              className="text-gray-600 hover:text-green-500 transition-colors duration-300"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white shadow-md rounded-md p-2 w-64">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Buscar productos"
                    className="flex-1 p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-green-500 transition-colors duration-300"
                  />
                  <button className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors duration-300">
                    <Search size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <a
            href="#"
            className="text-gray-600 hover:text-green-500 transition-colors duration-300"
          >
            <ShoppingCart size={20} />
          </a>
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-gray-600 hover:text-green-500 transition-colors duration-300"
              onClick={toggleUserMenu}
            >
              <User size={20} />
            </button>
            <div
              className={`absolute right-0 top-full mt-2 bg-white shadow-md rounded-md w-40 overflow-hidden transition-all duration-300 origin-top ${
                userMenuOpen
                  ? "opacity-100 transform scale-y-100"
                  : "opacity-0 transform scale-y-0 pointer-events-none"
              }`}
            >
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300"
              >
                Iniciar Sesión
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300"
              >
                Registrarse
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-green-500 transition-colors duration-300"
              >
                Mi Cuenta
              </a>
            </div>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md pt-2 pb-4 px-4">
          <div className="flex flex-col space-y-3">
            <div className="py-2 border-b border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Buscar productos invisibles..."
                  className="flex-1 p-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-green-500"
                />
                <button className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors">
                  <Search size={16} />
                </button>
              </div>
            </div>

            <button
              className="flex items-center justify-between w-full py-2 text-gray-600"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              <span>Categorías</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {categoriesOpen && (
              <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                {categories.map((category, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block py-1 text-gray-700 hover:text-green-500"
                  >
                    {/* {category} */}
                  </a>
                ))}
              </div>
            )}

            <a href="#" className="py-2 text-gray-600 border-b border-gray-200">
              Productos Destacados
            </a>
            <a href="#" className="py-2 text-gray-600 border-b border-gray-200">
              Sobre Nosotros
            </a>
            <a href="#" className="py-2 text-gray-600 border-b border-gray-200">
              Contacto
            </a>
            <a href="#" className="py-2 text-gray-600 border-b border-gray-200">
              Iniciar Sesión
            </a>
            <a href="#" className="py-2 text-gray-600">
              Registrarse
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
