import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const [usuarios]: any = await db.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.fecha_registro,
       (SELECT COUNT(*) FROM posts WHERE id_usuario = u.id_usuario) as total_posts,
       (SELECT COUNT(*) FROM comentarios WHERE id_usuario = u.id_usuario) as total_comentarios
       FROM usuarios u
       WHERE u.id_usuario = ?`,
      [id]
    );

    if (usuarios.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener roles del usuario
    const [roles]: any = await db.query(
      `SELECT r.* FROM roles r
       INNER JOIN usuario_roles ur ON r.id_rol = ur.id_rol
       WHERE ur.id_usuario = ?`,
      [id]
    );

    return NextResponse.json({ 
      usuario: {
        ...usuarios[0],
        roles
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
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
    const { nombre, email } = body;

    if (!nombre && !email) {
      return NextResponse.json(
        { error: 'Se debe proporcionar al menos un campo para actualizar' },
        { status: 400 }
      );
    }

    // Construir query dinámica
    const updates: string[] = [];
    const values: any[] = [];

    if (nombre) {
      updates.push('nombre = ?');
      values.push(nombre);
    }

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    values.push(id);

    const [result]: any = await db.query(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE id_usuario = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const [usuarios]: any = await db.query(
      'SELECT id_usuario, nombre, email, fecha_registro FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    return NextResponse.json({ 
      message: 'Usuario actualizado',
      usuario: usuarios[0]
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
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

    // Eliminar en cascada
    await db.query('DELETE FROM comentarios WHERE id_usuario = ?', [id]);
    
    // Obtener posts del usuario para eliminar archivos asociados
    const [posts]: any = await db.query(
      'SELECT id_post FROM posts WHERE id_usuario = ?',
      [id]
    );

    for (const post of posts) {
      await db.query('DELETE FROM archivos WHERE id_post = ?', [post.id_post]);
      await db.query('DELETE FROM comentarios WHERE id_post = ?', [post.id_post]);
    }

    await db.query('DELETE FROM posts WHERE id_usuario = ?', [id]);
    await db.query('DELETE FROM usuario_roles WHERE id_usuario = ?', [id]);

    const [result]: any = await db.query(
      'DELETE FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
