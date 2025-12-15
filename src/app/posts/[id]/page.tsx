'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaArrowLeft, FaUser, FaCalendar, FaTrash, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Post {
  id_post: number;
  titulo: string;
  contenido: string;
  fecha_creacion: string;
  id_usuario: number;
  usuario_nombre: string;
  comentarios: Comentario[];
  archivos: any[];
}

interface Comentario {
  id_comentario: number;
  texto: string;
  fecha: string;
  usuario_nombre: string;
  id_usuario: number;
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      const user = JSON.parse(userData);
      setIsAuthenticated(true);
      setCurrentUserId(user.id_usuario);
    }
    loadPost();
  }, [params.id]);

  const loadPost = async () => {
    try {
      setErrorMsg('');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      // Cargar post
      const response = await fetch(`${API_URL}/api/posts/${params.id}`);
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
      }
      
      const data = await response.json();
      console.log('📡 Respuesta de API (post detail):', data);
      
      const postData = data.post || data;
      postData.comentarios = []; // Inicializar array vacío
      
      // Cargar comentarios por separado
      try {
        console.log(`📝 Intentando cargar comentarios desde: ${API_URL}/api/comentarios/post/${params.id}`);
        const commentResponse = await fetch(`${API_URL}/api/comentarios/post/${params.id}`);
        
        if (commentResponse.ok) {
          const commentData = await commentResponse.json();
          console.log('💬 Respuesta de comentarios:', commentData);
          
          // Manejar diferentes estructuras de respuesta
          if (Array.isArray(commentData)) {
            postData.comentarios = commentData;
          } else if (commentData.comentarios && Array.isArray(commentData.comentarios)) {
            postData.comentarios = commentData.comentarios;
          } else if (commentData.data && Array.isArray(commentData.data)) {
            postData.comentarios = commentData.data;
          }
          
          console.log('✅ Comentarios asignados:', postData.comentarios);
        } else {
          console.warn(`⚠️ Respuesta de comentarios: ${commentResponse.status}`);
        }
      } catch (commentError: any) {
        console.warn('❌ Error cargando comentarios:', commentError?.message);
      }
      
      console.log('📋 Post data final:', postData);
      console.log(`💬 Total comentarios: ${postData.comentarios?.length || 0}`);
      setPost(postData);
      
    } catch (error: any) {
      console.error('Error al cargar post:', error);
      setErrorMsg(error?.message || 'Error desconocido al cargar post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comentarioTexto.trim()) return;

    try {
      const usuarioData = localStorage.getItem('usuario');
      if (!usuarioData) {
        router.push('/login');
        return;
      }

      const usuario = JSON.parse(usuarioData);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

      const response = await fetch(`${API_URL}/api/comentarios`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_post: params.id,
          id_usuario: usuario.id_usuario,
          texto: comentarioTexto,
        }),
      });

      if (response.ok) {
        setComentarioTexto('');
        loadPost(); // Recargar el post con los comentarios actualizados
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/posts/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/posts');
      }
    } catch (error) {
      console.error('Error al eliminar post:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Cargando post...</div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          {errorMsg && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded mb-6">
              Error: {errorMsg}
              <div className="text-sm text-red-700 mt-2">
                API_BASE: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
              </div>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-4">Post no encontrado</h1>
          <Link href="/posts" className="btn-primary">
            Volver a posts
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/posts" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft />
          Volver a posts
        </Link>

        {/* Post Card */}
        <div className="card mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{post.titulo}</h1>
            {currentUserId === post.id_usuario && (
              <div className="flex gap-2">
                <button className="text-primary-600 hover:text-primary-700">
                  <FaEdit size={20} />
                </button>
                <button 
                  onClick={handleDeletePost}
                  className="text-red-600 hover:text-red-700"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <FaUser />
              {post.usuario_nombre}
            </span>
            <span className="flex items-center gap-1">
              <FaCalendar />
              {format(new Date(post.fecha_creacion), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
            </span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.contenido}</p>
          </div>
        </div>

        {/* Comentarios Section */}
        <div className="mt-12">
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {post.comentarios?.length || 0} {post.comentarios?.length === 1 ? 'Comentario' : 'Comentarios'}
            </h2>

            {errorMsg && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Debug: mostrar estructura de comentarios */}
            {!post.comentarios && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6 text-sm">
                ⚠️ Sin campo comentarios en respuesta. Abre F12 consola para ver los datos.
              </div>
            )}

            {/* Formulario para agregar comentario */}
            {isAuthenticated ? (
              <form onSubmit={handleAddComentario} className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Comparte tu opinión
                </label>
                <textarea
                  value={comentarioTexto}
                  onChange={(e) => setComentarioTexto(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none text-gray-900 placeholder-gray-500 text-sm"
                  placeholder="¿Qué piensas al respecto? Sé constructivo y respetuoso..."
                  rows={4}
                  required
                />
                <div className="flex justify-end mt-3">
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm"
                  >
                    Publicar Comentario
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10 text-center">
                <p className="text-gray-700 text-sm">
                  <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Inicia sesión
                  </Link>
                  {' '}para dejar un comentario
                </p>
              </div>
            )}

            {/* Lista de comentarios */}
            <div className="space-y-6">
              {post.comentarios && post.comentarios.length > 0 ? (
                post.comentarios.map((comentario, index) => (
                  <div 
                    key={comentario.id_comentario}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-5">
                      {/* Icono Usuario */}
                      <div className="flex-shrink-0 mt-1">
                        <div className="text-primary-600 text-xl">
                          <FaUser />
                        </div>
                      </div>
                      
                      {/* Contenido */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div>
                            <p className="font-bold text-gray-900">
                              {comentario.usuario_nombre}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {format(new Date(comentario.fecha), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-6 whitespace-pre-wrap">
                          {comentario.texto}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="text-5xl mb-3">💭</div>
                  <p className="text-gray-700 font-medium">Sin comentarios aún</p>
                  <p className="text-gray-500 text-sm mt-2">Sé el primero en compartir tu perspectiva sobre este artículo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
