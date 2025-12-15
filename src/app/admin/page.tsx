'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FaUsers, FaFileAlt, FaComments, FaShieldAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  fecha_registro: string;
  total_posts: number;
  total_comentarios: number;
}

interface Rol {
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'usuarios' | 'roles'>('usuarios');

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    
    if (!userData) {
      router.push('/login');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const [usuariosRes, rolesRes] = await Promise.all([
        fetch(`${API_URL}/api/usuarios`, { credentials: 'include' }),
        fetch(`${API_URL}/api/roles`, { credentials: 'include' }),
      ]);

      const usuariosData = await usuariosRes.json();
      const rolesData = await rolesRes.json();

      if (usuariosRes.ok) setUsuarios(usuariosData.usuarios);
      if (rolesRes.ok) setRoles(rolesData.roles);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-pulse">Cargando panel de administración...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FaShieldAlt className="text-4xl text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-800">Panel de Administración</h1>
          </div>

          {/* Estadísticas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Usuarios</p>
                  <p className="text-4xl font-bold">{usuarios.length}</p>
                </div>
                <FaUsers className="text-5xl text-blue-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Posts</p>
                  <p className="text-4xl font-bold">
                    {usuarios.reduce((sum, u) => sum + (u.total_posts || 0), 0)}
                  </p>
                </div>
                <FaFileAlt className="text-5xl text-green-200" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Total Comentarios</p>
                  <p className="text-4xl font-bold">
                    {usuarios.reduce((sum, u) => sum + (u.total_comentarios || 0), 0)}
                  </p>
                </div>
                <FaComments className="text-5xl text-purple-200" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card">
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'usuarios'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'roles'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Roles
              </button>
            </div>

            {/* Tabla de Usuarios */}
            {activeTab === 'usuarios' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Fecha Registro</th>
                      <th className="text-center py-3 px-4">Posts</th>
                      <th className="text-center py-3 px-4">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id_usuario} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{usuario.id_usuario}</td>
                        <td className="py-3 px-4 font-medium">{usuario.nombre}</td>
                        <td className="py-3 px-4">{usuario.email}</td>
                        <td className="py-3 px-4">
                          {format(new Date(usuario.fecha_registro), 'dd/MM/yyyy', { locale: es })}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {usuario.total_posts || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            {usuario.total_comentarios || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Lista de Roles */}
            {activeTab === 'roles' && (
              <div>
                {roles.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No hay roles configurados</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {roles.map((rol) => (
                      <div key={rol.id_rol} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {rol.nombre_rol}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {rol.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
