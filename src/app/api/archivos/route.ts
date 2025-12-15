import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener todos los archivos
export async function GET(request: NextRequest) {
  try {
    const [archivos]: any = await db.query(
      `SELECT a.*, p.titulo as post_titulo 
       FROM archivos a
       LEFT JOIN posts p ON a.id_post = p.id_post
       ORDER BY a.id_archivo DESC`
    );

    return NextResponse.json({ archivos });
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return NextResponse.json(
      { error: 'Error al obtener archivos' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo archivo
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
    const { ruta, tipo, id_post } = body;

    if (!ruta || !id_post) {
      return NextResponse.json(
        { error: 'Ruta e id_post son requeridos' },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      'INSERT INTO archivos (ruta, tipo, id_post) VALUES (?, ?, ?)',
      [ruta, tipo || null, id_post]
    );

    const id_archivo = result.insertId;

    const [archivos]: any = await db.query(
      'SELECT * FROM archivos WHERE id_archivo = ?',
      [id_archivo]
    );

    return NextResponse.json({ archivo: archivos[0] }, { status: 201 });
  } catch (error) {
    console.error('Error al crear archivo:', error);
    return NextResponse.json(
      { error: 'Error al crear archivo' },
      { status: 500 }
    );
  }
}
