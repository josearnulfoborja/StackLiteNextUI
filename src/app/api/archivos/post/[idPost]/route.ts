import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener archivos de un post específico
export async function GET(
  request: NextRequest,
  { params }: { params: { idPost: string } }
) {
  try {
    const idPost = params.idPost;

    const [archivos]: any = await db.query(
      'SELECT * FROM archivos WHERE id_post = ? ORDER BY id_archivo DESC',
      [idPost]
    );

    return NextResponse.json({ archivos });
  } catch (error) {
    console.error('Error al obtener archivos del post:', error);
    return NextResponse.json(
      { error: 'Error al obtener archivos del post' },
      { status: 500 }
    );
  }
}
