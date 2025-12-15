'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaUser, FaEnvelope, FaCalendar, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  fecha_registro: string;
}

interface UserPost {
  id_post: number;
  titulo: string;
  fecha_creacion: string;
  total_comentarios: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    setUsuario(user);
    loadUserPosts(user.id_usuario);
  }, [router]);

  const loadUserPosts = async (userId: number) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/posts/usuario/${userId}`);
      const data = await response.json();
      
      setPosts(data.posts);
    } catch (error) {
      console.error('Error al cargar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !usuario) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Cargando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Perfil del Usuario */}
          <div className="card mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Dashboard</h1>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Nombre</p>
                      <p className="font-medium">{usuario.nombre}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendar className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Miembro desde</p>
                      <p className="font-medium">
                        {format(new Date(usuario.fecha_registro), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary-600">{posts.length}</p>
                    <p className="text-sm text-gray-600">Posts publicados</p>
                  </div>
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-primary-600">
                      {posts.reduce((sum, post) => sum + (post.total_comentarios || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600">Comentarios recibidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts del Usuario */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mis Posts</h2>
              <Link href="/posts/crear" className="btn-primary">
                Crear Nuevo Post
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-8">
                <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No has publicado ningún post todavía</p>
                <Link href="/posts/crear" className="btn-primary inline-block">
                  Crear tu primer post
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link 
                    key={post.id_post} 
                    href={`/posts/${post.id_post}`}
                    className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary-600">
                      {post.titulo}
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>
                        {format(new Date(post.fecha_creacion), "dd MMM yyyy", { locale: es })}
                      </span>
                      <span>
                        {post.total_comentarios || 0} comentarios
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
