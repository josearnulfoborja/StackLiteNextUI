import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener posts de un usuario específico
export async function GET(
  request: NextRequest,
  { params }: { params: { idUsuario: string } }
) {
  try {
    const idUsuario = params.idUsuario;

    const [posts]: any = await db.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email,
       (SELECT COUNT(*) FROM comentarios WHERE id_post = p.id_post) as total_comentarios
       FROM posts p
       LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_usuario = ?
       ORDER BY p.fecha_creacion DESC`,
      [idUsuario]
    );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error al obtener posts del usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener posts del usuario' },
      { status: 500 }
    );
  }
}
