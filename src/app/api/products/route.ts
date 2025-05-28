import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/app/models/Product';

// GET - Obtener todos los productos
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.title || !body.description || !body.price || !body.imageUrl || !body.category) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    const newProduct = new Product({
      title: body.title,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      stock: body.stock || 0,
      category: body.category,
      isVisible: body.isVisible !== undefined ? body.isVisible : true,
    });
    
    await newProduct.save();
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear el producto' },
      { status: 500 }
    );
  }
} 