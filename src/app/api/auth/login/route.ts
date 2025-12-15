import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { LoginData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginData = await request.json();
    const { email, contraseña } = body;

    // Validaciones
    if (!email || !contraseña) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario
    const [users]: any = await db.query(
      'SELECT id_usuario, nombre, email, contraseña_hash, fecha_registro FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const usuario = users[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Eliminar hash de la respuesta
    delete usuario.contraseña_hash;

    // Generar token
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
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}
