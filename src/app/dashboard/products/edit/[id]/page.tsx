"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Search, ChevronDown, ChevronUp } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
    categories: [] as string[],
    subcategories: [] as string[],
    isVisible: true,
  });

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategories = CATEGORIES.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  // Añadir un botón para expandir/colapsar todas las categorías
  const toggleAllCategories = () => {
    if (expandedCategories.length === CATEGORIES.length) {
      // Si todas están expandidas, colapsar todas
      setExpandedCategories([]);
    } else {
      // Si no todas están expandidas, expandir todas
      setExpandedCategories(CATEGORIES.map((cat) => cat.id));
    }
  };

  // Cargar datos del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Error al cargar el producto");
        }

        const product = await response.json();

        // Establecer los datos del formulario
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          imageUrl: product.imageUrl,
          stock: product.stock.toString(),
          categories: Array.isArray(product.categories)
            ? product.categories
            : [product.categories].filter(Boolean),
          subcategories: Array.isArray(product.subcategories)
            ? product.subcategories
            : [],
          isVisible: product.isVisible,
        });

        // Expandir automáticamente las categorías que tienen subcategorías seleccionadas
        if (
          Array.isArray(product.subcategories) &&
          product.subcategories.length > 0
        ) {
          // Extraer los IDs de categoría de las subcategorías (formato: "categoryId-subcategoryId")
          const categoriesWithSelectedSubs = product.subcategories
            .map((sub: string) => sub.split("-")[0])
            .filter(
              (value: string, index: number, self: string[]) =>
                self.indexOf(value) === index,
            );

          // Expandir esas categorías y también las categorías principales seleccionadas
          const allCategoriesToExpand = [
            ...categoriesWithSelectedSubs,
            ...(Array.isArray(product.categories) ? product.categories : []),
          ].filter(
            (value: string, index: number, self: string[]) =>
              self.indexOf(value) === index,
          );

          setExpandedCategories(allCategoriesToExpand);
        } else if (
          Array.isArray(product.categories) &&
          product.categories.length > 0
        ) {
          // Si no hay subcategorías pero sí hay categorías, expandir las categorías seleccionadas
          setExpandedCategories(product.categories);
        }
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError(
          "No se pudo cargar el producto. Verifica que exista o intenta más tarde.",
        );
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;

      if (name === "category") {
        // Para las categorías (que son checkboxes con name="category")
        const categoryId = value;

        setFormData((prev) => {
          if (isChecked) {
            // Añadir categoría si no está ya en el array
            return {
              ...prev,
              categories: [...prev.categories, categoryId],
            };
          } else {
            // Quitar categoría del array y también todas sus subcategorías
            const category = CATEGORIES.find((cat) => cat.id === categoryId);

            return {
              ...prev,
              categories: prev.categories.filter((cat) => cat !== categoryId),
              // Filtrar todas las subcategorías que pertenecen a esta categoría
              subcategories: prev.subcategories.filter(
                (sub) => !sub.startsWith(`${categoryId}-`),
              ),
            };
          }
        });
      } else if (name === "subcategory") {
        // Para las subcategorías
        const subcategoryId = value;
        const [categoryId, subId] = subcategoryId.split("-"); // Formato "categoryId-subcategoryId"

        setFormData((prev) => {
          if (isChecked) {
            // Añadir subcategoría y siempre marcar la categoría padre
            const updatedCategories = prev.categories.includes(categoryId)
              ? prev.categories
              : [...prev.categories, categoryId];

            return {
              ...prev,
              categories: updatedCategories,
              subcategories: [...prev.subcategories, subcategoryId],
            };
          } else {
            // Quitar subcategoría pero mantener la categoría padre
            return {
              ...prev,
              subcategories: prev.subcategories.filter(
                (sub) => sub !== subcategoryId,
              ),
            };
          }
        });
      } else {
        // Para otros checkboxes (como isVisible)
        setFormData((prev) => ({
          ...prev,
          [name]: isChecked,
        }));
      }
    } else {
      // Para otros tipos de input (text, number, etc.)
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "stock"
            ? value === ""
              ? ""
              : parseFloat(value) || 0
            : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que se haya seleccionado al menos una categoría
    if (formData.categories.length === 0) {
      setError("Debes seleccionar al menos una categoría");
      return;
    }

    setLoading(true);
    setError(null);

    // Convertir strings vacíos a números antes de enviar y redondear el precio a entero
    const dataToSubmit = {
      ...formData,
      price: formData.price === "" ? 0 : Math.round(Number(formData.price)),
      stock: formData.stock === "" ? 0 : Number(formData.stock),
    };

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el producto");
      }

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al actualizar el producto");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="loader">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          <span>Volver al Panel</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Producto</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL de la Imagen <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              {/* Previsualización de la imagen */}
              {formData.imageUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Vista previa
                  </p>
                  <div className="w-full h-40 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={formData.imageUrl}
                      alt="Vista previa"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVisible"
                  name="isVisible"
                  checked={formData.isVisible}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isVisible"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Visible para los clientes
                </label>
              </div>
            </div>
          </div>

          {/* Sección de categorías y subcategorías */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Categorías y Subcategorías{" "}
                <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={toggleAllCategories}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {expandedCategories.length === CATEGORIES.length
                  ? "Colapsar todas"
                  : "Expandir todas"}
              </button>
            </div>

            <div className="mb-4 flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar categorías o subcategorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="bg-gray-200 text-gray-700 px-4 rounded-r-md hover:bg-gray-300"
              >
                Limpiar
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="mb-4 border-b pb-2 last:border-0"
                >
                  <div
                    className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md"
                    onClick={() => toggleCategoryExpansion(category.id)}
                  >
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      name="category"
                      value={category.id}
                      checked={formData.categories.includes(category.id)}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()} // Evitar que el clic en el checkbox expanda la categoría
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm font-medium text-gray-700 cursor-pointer flex-grow"
                      onClick={(e) => e.stopPropagation()} // Evitar que el clic en la etiqueta expanda la categoría
                    >
                      {category.name}
                      {/* Mostrar contador de subcategorías */}
                      <span className="text-xs text-gray-500 ml-2">
                        ({category.subcategories.length} subcategorías)
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={
                        expandedCategories.includes(category.id)
                          ? "Colapsar subcategorías"
                          : "Expandir subcategorías"
                      }
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {/* Subcategorías */}
                  {expandedCategories.includes(category.id) && (
                    <div className="ml-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.subcategories.map((subcategory) => {
                        const subcategoryFullId = `${category.id}-${subcategory.id}`;
                        return (
                          <div
                            key={subcategory.id}
                            className="flex items-center"
                          >
                            <input
                              type="checkbox"
                              id={`subcategory-${subcategoryFullId}`}
                              name="subcategory"
                              value={subcategoryFullId}
                              checked={formData.subcategories.includes(
                                subcategoryFullId,
                              )}
                              onChange={(e) => {
                                // Asegurarse de que también se seleccione la categoría principal
                                const isChecked = e.target.checked;
                                if (
                                  isChecked &&
                                  !formData.categories.includes(category.id)
                                ) {
                                  // Si está marcando la subcategoría y la categoría principal no está seleccionada
                                  setFormData((prev) => ({
                                    ...prev,
                                    categories: [
                                      ...prev.categories,
                                      category.id,
                                    ],
                                    subcategories: [
                                      ...prev.subcategories,
                                      subcategoryFullId,
                                    ],
                                  }));
                                } else {
                                  // Comportamiento normal
                                  handleChange(e);
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`subcategory-${subcategoryFullId}`}
                              className="ml-2 text-sm text-gray-600 flex items-center"
                            >
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                              {subcategory.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <div>Categorías seleccionadas: {formData.categories.length}</div>
              <div>
                Subcategorías seleccionadas: {formData.subcategories.length}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              <span>{loading ? "Guardando..." : "Actualizar Producto"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
