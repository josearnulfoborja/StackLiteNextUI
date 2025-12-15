export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  fecha_registro: string;
  roles?: Rol[];
}

export interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion?: string;
}

export interface Post {
  id_post: number;
  titulo: string;
  contenido: string;
  fecha_creacion: string;
  id_usuario: number;
  usuario?: Usuario;
  comentarios?: Comentario[];
  archivos?: Archivo[];
}

export interface Comentario {
  id_comentario: number;
  id_post: number;
  id_usuario: number;
  texto: string;
  fecha: string;
  usuario?: Usuario;
}

export interface Archivo {
  id_archivo: number;
  ruta: string;
  tipo: string;
  id_post: number;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginData {
  email: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contraseña: string;
}
