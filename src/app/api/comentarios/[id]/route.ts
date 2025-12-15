import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener comentario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const [comentarios]: any = await db.query(
      `SELECT c.*, u.nombre as usuario_nombre, p.titulo as post_titulo
       FROM comentarios c
       LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
       LEFT JOIN posts p ON c.id_post = p.id_post
       WHERE c.id_comentario = ?`,
      [id]
    );

    if (comentarios.length === 0) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ comentario: comentarios[0] });
  } catch (error) {
    console.error('Error al obtener comentario:', error);
    return NextResponse.json(
      { error: 'Error al obtener comentario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar comentario
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
    const { texto } = body;

    if (!texto) {
      return NextResponse.json(
        { error: 'El texto es requerido' },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      'UPDATE comentarios SET texto = ? WHERE id_comentario = ?',
      [texto, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    const [comentarios]: any = await db.query(
      `SELECT c.*, u.nombre as usuario_nombre
       FROM comentarios c
       LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
       WHERE c.id_comentario = ?`,
      [id]
    );

    return NextResponse.json({ 
      message: 'Comentario actualizado',
      comentario: comentarios[0]
    });
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar comentario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar comentario
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

    const [result]: any = await db.query(
      'DELETE FROM comentarios WHERE id_comentario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar comentario' },
      { status: 500 }
    );
  }
}
