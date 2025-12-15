import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Obtener post con información del usuario
    const [posts]: any = await db.query(
      `SELECT p.*, u.nombre as usuario_nombre, u.email as usuario_email
       FROM posts p
       LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_post = ?`,
      [id]
    );

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    // Obtener comentarios del post
    const [comentarios]: any = await db.query(
      `SELECT c.*, u.nombre as usuario_nombre
       FROM comentarios c
       LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_post = ?
       ORDER BY c.fecha DESC`,
      [id]
    );

    // Obtener archivos del post
    const [archivos]: any = await db.query(
      'SELECT * FROM archivos WHERE id_post = ?',
      [id]
    );

    return NextResponse.json({
      post: {
        ...posts[0],
        comentarios,
        archivos,
      },
    });
  } catch (error) {
    console.error('Error al obtener post:', error);
    return NextResponse.json(
      { error: 'Error al obtener post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await request.json();
    const { titulo, contenido } = body;

    await db.query(
      'UPDATE posts SET titulo = ?, contenido = ? WHERE id_post = ?',
      [titulo, contenido, id]
    );

    return NextResponse.json({ message: 'Post actualizado' });
  } catch (error) {
    console.error('Error al actualizar post:', error);
    return NextResponse.json(
      { error: 'Error al actualizar post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const id = params.id;

    // Eliminar comentarios asociados
    await db.query('DELETE FROM comentarios WHERE id_post = ?', [id]);
    
    // Eliminar archivos asociados
    await db.query('DELETE FROM archivos WHERE id_post = ?', [id]);
    
    // Eliminar post
    await db.query('DELETE FROM posts WHERE id_post = ?', [id]);

    return NextResponse.json({ message: 'Post eliminado' });
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return NextResponse.json(
      { error: 'Error al eliminar post' },
      { status: 500 }
    );
  }
}
