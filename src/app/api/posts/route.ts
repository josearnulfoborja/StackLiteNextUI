import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pagina = parseInt(searchParams.get('pagina') || '1');
    const limite = parseInt(searchParams.get('limite') || '10');
    
    // Calcular offset basado en la página
    const offset = (pagina - 1) * limite;

    // Obtener el total de posts para la paginación
    const [countResult]: any = await db.query(
      'SELECT COUNT(*) as total FROM posts'
    );
    const total = countResult[0].total;

    const [posts]: any = await db.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email,
       (SELECT COUNT(*) FROM comentarios WHERE id_post = p.id_post) as total_comentarios
       FROM posts p
       LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
       ORDER BY p.fecha_creacion DESC
       LIMIT ? OFFSET ?`,
      [limite, offset]
    );

    return NextResponse.json({ 
      posts,
      paginacion: {
        pagina_actual: pagina,
        limite: limite,
        total_posts: total,
        total_paginas: Math.ceil(total / limite)
      }
    });
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return NextResponse.json(
      { error: 'Error al obtener posts' },
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
    const { titulo, contenido, id_usuario } = body;

    if (!titulo || !contenido || !id_usuario) {
      return NextResponse.json(
        { error: 'Titulo, contenido e id_usuario son requeridos' },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      'INSERT INTO posts (titulo, contenido, id_usuario) VALUES (?, ?, ?)',
      [titulo, contenido, id_usuario]
    );

    const id_post = result.insertId;

    const [posts]: any = await db.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email
       FROM posts p
       LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_post = ?`,
      [id_post]
    );

    return NextResponse.json({ post: posts[0] });
  } catch (error) {
    console.error('Error al crear post:', error);
    return NextResponse.json(
      { error: 'Error al crear post' },
      { status: 500 }
    );
  }
}
