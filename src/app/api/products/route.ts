import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/app/models/Product';

// GET - Obtener todos los productos
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Obtener todos los productos
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo producto
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const data = await req.json();
    
    // Validar datos requeridos
    if (!data.title || !data.description || data.price === undefined || !data.imageUrl) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }
    
    // Crear nuevo producto
    const product = await Product.create({
      title: data.title,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      stock: data.stock || 0,
      categories: data.categories || [],
      subcategories: data.subcategories || [],
      isVisible: data.isVisible !== undefined ? data.isVisible : true,
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
} 