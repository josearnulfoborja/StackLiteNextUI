import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { RegisterData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    const { nombre, email, contraseña } = body;

    // Validaciones
    if (!nombre || !email || !contraseña) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const [existingUsers]: any = await db.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    // Insertar usuario
    const [result]: any = await db.query(
      'INSERT INTO usuarios (nombre, email, contraseña_hash) VALUES (?, ?, ?)',
      [nombre, email, contraseña_hash]
    );

    const id_usuario = result.insertId;

    // Asignar rol de usuario por defecto (id_rol = 2, ajustar según tu DB)
    await db.query(
      'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES (?, 2)',
      [id_usuario]
    );

    // Obtener usuario creado
    const [users]: any = await db.query(
      'SELECT id_usuario, nombre, email, fecha_registro FROM usuarios WHERE id_usuario = ?',
      [id_usuario]
    );

    const usuario = users[0];
    const token = generateToken(usuario);

    const response = NextResponse.json({
      token,
      usuario,
    });

    // Establecer cookie con el token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
