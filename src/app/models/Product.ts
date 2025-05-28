import mongoose, { Schema, Document } from 'mongoose';

// Definir la interfaz para nuestro modelo de Producto
export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  categories: string[]; // IDs de categorías
  subcategories: string[]; // IDs de subcategorías
  isVisible: boolean;
}

// Crear el esquema para el Producto
const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    categories: { type: [String], required: true, default: [] },
    subcategories: { type: [String], default: [] }, // Array de IDs de subcategorías
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true } // Esto añadirá automáticamente createdAt y updatedAt
);

// Exportar el modelo
export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 