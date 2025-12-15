import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener comentarios de un post específico
export async function GET(
  request: NextRequest,
  { params }: { params: { idPost: string } }
) {
  try {
    const idPost = params.idPost;

    const [comentarios]: any = await db.query(
      `SELECT c.*, u.nombre as usuario_nombre
       FROM comentarios c
       LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_post = ?
       ORDER BY c.fecha DESC`,
      [idPost]
    );

    return NextResponse.json({ comentarios });
  } catch (error) {
    console.error('Error al obtener comentarios del post:', error);
    return NextResponse.json(
      { error: 'Error al obtener comentarios del post' },
      { status: 500 }
    );
  }
}
