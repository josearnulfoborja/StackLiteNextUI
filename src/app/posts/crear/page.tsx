'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function CrearPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuarioData = localStorage.getItem('usuario');
      if (!usuarioData) {
        router.push('/login');
        return;
      }

      const usuario = JSON.parse(usuarioData);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_usuario: usuario.id_usuario,
        }),
      });

      const data = await response.json();
      
      console.log('📡 Respuesta del API crear post:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear post');
      }

      // Manejar diferentes estructuras de respuesta
      const postId = data.post?.id_post || data.id_post || data.id;
      
      if (!postId) {
        console.error('❌ No se encontró id_post en la respuesta:', data);
        throw new Error('El servidor no retornó el ID del post creado');
      }

      console.log('✅ Post creado con ID:', postId);
      router.push(`/posts/${postId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/posts" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft />
          Volver a posts
        </Link>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crear Nuevo Post</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="input-field"
                placeholder="Escribe un título atractivo..."
                required
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Contenido
              </label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleChange}
                className="input-field min-h-[300px] resize-y"
                placeholder="Escribe el contenido de tu post..."
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Publicar Post'}
              </button>
              <Link href="/posts" className="btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
