import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener archivo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const [archivos]: any = await db.query(
      `SELECT a.*, p.titulo as post_titulo 
       FROM archivos a
       LEFT JOIN posts p ON a.id_post = p.id_post
       WHERE a.id_archivo = ?`,
      [id]
    );

    if (archivos.length === 0) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ archivo: archivos[0] });
  } catch (error) {
    console.error('Error al obtener archivo:', error);
    return NextResponse.json(
      { error: 'Error al obtener archivo' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar archivo
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
      'DELETE FROM archivos WHERE id_archivo = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Archivo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return NextResponse.json(
      { error: 'Error al eliminar archivo' },
      { status: 500 }
    );
  }
}
