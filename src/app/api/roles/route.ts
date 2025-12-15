import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const [roles]: any = await db.query('SELECT * FROM roles');

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    return NextResponse.json(
      { error: 'Error al obtener roles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { nombre_rol, descripcion } = body;

    const [result]: any = await db.query(
      'INSERT INTO roles (nombre_rol, descripcion) VALUES (?, ?)',
      [nombre_rol, descripcion || null]
    );

    return NextResponse.json({ 
      id_rol: result.insertId,
      nombre_rol,
      descripcion 
    });
  } catch (error) {
    console.error('Error al crear rol:', error);
    return NextResponse.json(
      { error: 'Error al crear rol' },
      { status: 500 }
    );
  }
}
