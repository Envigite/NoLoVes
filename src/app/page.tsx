import React from "react";
import { CATEGORIES } from "@/constants/categories";
import HeaderCarousel from "@/components/Header";
import Link from "next/link";
import { Eye, ShoppingCart, Tag } from "lucide-react";
import ProductosComponent from "@/components/ProductosComponent";

// Componente de página principal
export default function HomePage() {
  return (
    <main>
      <HeaderCarousel />

      <div className="container mx-auto px-4 py-12">
        {/* Productos destacados */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Productos Destacados
          </h2>

          {/* Componente del lado del cliente para manejar la carga de productos */}
          <ProductosComponent />

          <div className="text-center mt-8">
            <Link
              href="/productos"
              className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>

        {/* Categorías destacadas */}
        <div className="mt-16 mb-10">
          <h2 className="text-3xl font-bold mb-8 text-center">Categorías</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {CATEGORIES.slice(0, 6).map((category, index) => (
              <Link
                key={category.id}
                href={`/productos/categoria/${category.id}`}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    {index % 4 === 0 && <Eye size={24} />}
                    {index % 4 === 1 && <Tag size={24} />}
                    {index % 4 === 2 && <ShoppingCart size={24} />}
                    {index % 4 === 3 && <Eye size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-white/80 text-sm">
                      {category.subcategories.length} subcategorías
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/productos"
              className="inline-block bg-white text-green-600 border border-green-500 px-6 py-3 rounded-md transition-all duration-300 hover:bg-green-50"
            >
              Ver todas las categorías
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
