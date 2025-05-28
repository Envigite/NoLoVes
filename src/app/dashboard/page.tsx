"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  categories: string[];
  subcategories: string[];
  imageUrl: string;
  isVisible: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el nombre de una categoría por su ID
  const getCategoryNameById = (categoryId: string): string => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Función para obtener el nombre de una subcategoría por su ID compuesto
  const getSubcategoryNameById = (
    subcategoryId: string,
  ): { name: string; categoryName: string } => {
    const [categoryId, subId] = subcategoryId.split("-");
    const category = CATEGORIES.find((cat) => cat.id === categoryId);

    if (!category) return { name: subcategoryId, categoryName: "" };

    const subcategory = category.subcategories.find((sub) => sub.id === subId);
    return {
      name: subcategory ? subcategory.name : subcategoryId,
      categoryName: category.name,
    };
  };

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(
          "Error al cargar los productos. Inténtalo de nuevo más tarde.",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Eliminar producto
  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el producto");
        }

        // Actualizar la lista de productos
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        setError("Error al eliminar el producto");
        console.error(err);
      }
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Link
          href="/dashboard/products/new"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          <PlusCircle size={20} />
          <span>Nuevo Producto</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Cargando...</div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorías y Subcategorías
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No hay productos disponibles. Crea uno nuevo.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 overflow-hidden rounded-md">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${product.price.toLocaleString("es-CL")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {/* Categorías */}
                          {product.categories &&
                          product.categories.length > 0 ? (
                            product.categories.map((categoryId, idx) => (
                              <span
                                key={`${product._id}-cat-${idx}`}
                                className="inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 bg-blue-100 text-blue-800 mb-1"
                                title={getCategoryNameById(categoryId)}
                              >
                                {getCategoryNameById(categoryId)}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              Sin categoría
                            </span>
                          )}

                          {/* Subcategorías */}
                          {product.subcategories &&
                            product.subcategories.length > 0 &&
                            product.subcategories.map((subcategoryId, idx) => {
                              const { name, categoryName } =
                                getSubcategoryNameById(subcategoryId);
                              return (
                                <span
                                  key={`${product._id}-subcat-${idx}`}
                                  className="inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 bg-green-100 text-green-800 mb-1"
                                  title={`${categoryName} > ${name}`}
                                >
                                  {name}
                                </span>
                              );
                            })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.isVisible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.isVisible ? "Visible" : "Oculto"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard/products/edit/${product._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
