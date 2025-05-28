import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/app/models/Product';

interface Params {
  params: {
    id: string;
  };
}

// GET - Obtener un producto por ID
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    await connectDB();
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un producto por ID
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    
    await connectDB();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un producto por ID
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Producto eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    );
  }
} 