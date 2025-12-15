import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener rol por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const [roles]: any = await db.query(
      'SELECT * FROM roles WHERE id_rol = ?',
      [id]
    );

    if (roles.length === 0) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ rol: roles[0] });
  } catch (error) {
    console.error('Error al obtener rol:', error);
    return NextResponse.json(
      { error: 'Error al obtener rol' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar rol
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
    const { nombre_rol, descripcion } = body;

    if (!nombre_rol) {
      return NextResponse.json(
        { error: 'El nombre del rol es requerido' },
        { status: 400 }
      );
    }

    const [result]: any = await db.query(
      'UPDATE roles SET nombre_rol = ?, descripcion = ? WHERE id_rol = ?',
      [nombre_rol, descripcion || null, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 404 }
      );
    }

    const [roles]: any = await db.query(
      'SELECT * FROM roles WHERE id_rol = ?',
      [id]
    );

    return NextResponse.json({ 
      message: 'Rol actualizado',
      rol: roles[0]
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    return NextResponse.json(
      { error: 'Error al actualizar rol' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar rol
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

    // Eliminar primero las relaciones en usuario_roles
    await db.query('DELETE FROM usuario_roles WHERE id_rol = ?', [id]);

    // Eliminar el rol
    const [result]: any = await db.query(
      'DELETE FROM roles WHERE id_rol = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    return NextResponse.json(
      { error: 'Error al eliminar rol' },
      { status: 500 }
    );
  }
}
