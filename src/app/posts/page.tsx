'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { FaPlus, FaComment, FaCalendar, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Post {
  id_post: number;
  titulo: string;
  contenido: string;
  fecha_creacion: string;
  usuario_nombre: string;
  total_comentarios: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    setIsAuthenticated(!!userData);
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setErrorMsg('');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/posts?pagina=1&limite=100`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
      }
      const data = await response.json();
      console.log('📡 Respuesta de API:', data);
      const list = Array.isArray(data.posts) ? data.posts : Array.isArray(data) ? data : [];
      console.log('📋 Posts a renderizar:', list);
      setPosts(list);
      if (!list.length && list !== data) {
        setErrorMsg(`API respondió: ${JSON.stringify(data).substring(0, 100)}...`);
      }
    } catch (error) {
      console.error('Error al cargar posts:', error);
      setErrorMsg(error?.message || 'Error desconocido al cargar posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Cargando posts...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Posts</h1>
          {isAuthenticated && (
            <Link href="/posts/crear" className="btn-primary flex items-center gap-2">
              <FaPlus />
              Crear Post
            </Link>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-6">
            Error cargando posts: {errorMsg}
            <div className="text-sm text-red-700 mt-2">
              API_BASE: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No hay posts todavía</p>
            {isAuthenticated && (
              <Link href="/posts/crear" className="btn-primary inline-block">
                Crear el primer post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id_post} href={`/posts/${post.id_post}`}>
                <div className="card hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-primary-600 transition-colors">
                    {post.titulo}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateText(post.contenido, 150)}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-auto">
                    <span className="flex items-center gap-1">
                      <FaUser />
                      {post.usuario_nombre}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaComment />
                      {post.total_comentarios} comentarios
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {format(new Date(post.fecha_creacion), 'dd MMM yyyy', { locale: es })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
