import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener todos los comentarios
export async function GET(request: NextRequest) {
  try {
    const [comentarios]: any = await db.query(
      `SELECT c.*, u.nombre as usuario_nombre, p.titulo as post_titulo
       FROM comentarios c
       LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
       LEFT JOIN posts p ON c.id_post = p.id_post
       ORDER BY c.fecha DESC`
    );

    return NextResponse.json({ comentarios });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo comentario
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
    const { id_post, id_usuario, texto } = body;

    if (!id_post || !id_usuario || !texto) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      'INSERT INTO comentarios (id_post, id_usuario, texto) VALUES (?, ?, ?)',
      [id_post, id_usuario, texto]
    );

    const id_comentario = result.insertId;

    const [comentarios]: any = await db.query(
      `SELECT c.*, u.nombre as usuario_nombre
       FROM comentarios c
       LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_comentario = ?`,
      [id_comentario]
    );

    return NextResponse.json({ comentario: comentarios[0] }, { status: 201 });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    );
  }
}
