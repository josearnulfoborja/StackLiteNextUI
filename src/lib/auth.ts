import jwt from 'jsonwebtoken';
import { Usuario } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export function generateToken(usuario: Usuario): string {
  return jwt.sign(
    { 
      id_usuario: usuario.id_usuario, 
      email: usuario.email,
      nombre: usuario.nombre 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
