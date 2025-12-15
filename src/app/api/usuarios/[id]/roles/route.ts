import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Obtener roles del usuario
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const [roles]: any = await db.query(
      `SELECT r.* FROM roles r
       INNER JOIN usuario_roles ur ON r.id_rol = ur.id_rol
       WHERE ur.id_usuario = ?`,
      [id]
    );

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error al obtener roles del usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener roles del usuario' },
      { status: 500 }
    );
  }
}

// POST - Asignar rol a usuario
export async function POST(
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
    const { id_rol } = body;

    if (!id_rol) {
      return NextResponse.json(
        { error: 'El id_rol es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const [usuarios]: any = await db.query(
      'SELECT id_usuario FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    if (usuarios.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el rol existe
    const [roles]: any = await db.query(
      'SELECT id_rol FROM roles WHERE id_rol = ?',
      [id_rol]
    );

    if (roles.length === 0) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya existe la relación
    const [existing]: any = await db.query(
      'SELECT * FROM usuario_roles WHERE id_usuario = ? AND id_rol = ?',
      [id, id_rol]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'El usuario ya tiene este rol asignado' },
        { status: 400 }
      );
    }

    // Insertar la relación
    await db.query(
      'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?, ?)',
      [id, id_rol]
    );

    return NextResponse.json({ 
      message: 'Rol asignado correctamente',
      id_usuario: id,
      id_rol
    }, { status: 201 });
  } catch (error) {
    console.error('Error al asignar rol:', error);
    return NextResponse.json(
      { error: 'Error al asignar rol' },
      { status: 500 }
    );
  }
}
