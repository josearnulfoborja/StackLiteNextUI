import Link from 'next/link';
import { FaArrowRight, FaUsers, FaFileAlt, FaComments } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Bienvenido a StackLite</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Una plataforma moderna para compartir posts, comentarios y conectar con otros usuarios
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/registro" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
              Comenzar <FaArrowRight />
            </Link>
            <Link href="/login" className="bg-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors border-2 border-white">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-primary-600 text-5xl mb-4 flex justify-center">
              <FaUsers />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sistema de Usuarios</h3>
            <p className="text-gray-600">Registro seguro con roles y permisos personalizados</p>
          </div>
          <div className="card text-center">
            <div className="text-primary-600 text-5xl mb-4 flex justify-center">
              <FaFileAlt />
            </div>
            <h3 className="text-xl font-semibold mb-3">Crear Posts</h3>
            <p className="text-gray-600">Publica contenido con texto enriquecido y archivos adjuntos</p>
          </div>
          <div className="card text-center">
            <div className="text-primary-600 text-5xl mb-4 flex justify-center">
              <FaComments />
            </div>
            <h3 className="text-xl font-semibold mb-3">Comentarios</h3>
            <p className="text-gray-600">Interactúa con otros usuarios mediante comentarios</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-gray-600 mb-8">Únete a nuestra comunidad hoy mismo</p>
          <Link href="/posts" className="btn-primary inline-block">
            Explorar Posts
          </Link>
        </div>
      </section>
    </div>
  );
}
