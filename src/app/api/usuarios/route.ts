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

    const [usuarios]: any = await db.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.fecha_registro,
       (SELECT COUNT(*) FROM posts WHERE id_usuario = u.id_usuario) as total_posts,
       (SELECT COUNT(*) FROM comentarios WHERE id_usuario = u.id_usuario) as total_comentarios
       FROM usuarios u
       ORDER BY u.fecha_registro DESC`
    );

    return NextResponse.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}
