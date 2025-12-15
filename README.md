# StackLite - Next.js Frontend

Una aplicación web moderna construida con Next.js 14, TypeScript y Tailwind CSS para gestionar posts, comentarios y usuarios.

## 🚀 Características

- ✅ Sistema de autenticación (registro/login)
- ✅ Gestión de posts con comentarios
- ✅ Sistema de roles de usuario
- ✅ Panel de administración
- ✅ Dashboard personalizado
- ✅ UI responsive y moderna
- ✅ TypeScript para type-safety
- ✅ Integración con MySQL

## 📋 Requisitos Previos

- Node.js 18+ 
- MySQL 8.0+
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd StackLiteNextUI
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar la base de datos**

Ejecuta el script SQL proporcionado para crear la base de datos:

```sql
CREATE DATABASE web_sencilla;
-- (resto del script SQL)
```

4. **Configurar variables de entorno**

Edita el archivo `.env.local` con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=web_sencilla
DB_PORT=3306

JWT_SECRET=tu_clave_secreta_muy_segura
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

5. **Iniciar la aplicación**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/              # API Routes (Backend)
│   │   ├── auth/         # Autenticación
│   │   ├── posts/        # Posts
│   │   ├── comentarios/  # Comentarios
│   │   ├── usuarios/     # Usuarios
│   │   └── roles/        # Roles
│   ├── login/            # Página de login
│   ├── registro/         # Página de registro
│   ├── posts/            # Páginas de posts
│   ├── dashboard/        # Dashboard del usuario
│   ├── admin/            # Panel de administración
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página de inicio
│   └── globals.css       # Estilos globales
├── components/           # Componentes reutilizables
│   └── Navbar.tsx        # Barra de navegación
├── lib/                  # Utilidades
│   ├── db.ts            # Conexión a base de datos
│   └── auth.ts          # Funciones de autenticación
├── types/               # Tipos TypeScript
│   └── index.ts         # Definiciones de tipos
└── middleware.ts        # Middleware de Next.js
```

## 🎯 Funcionalidades Principales

### Autenticación
- Registro de nuevos usuarios
- Login con email y contraseña
- JWT para mantener sesión
- Middleware para proteger rutas

### Posts
- Crear posts con título y contenido
- Ver listado de todos los posts
- Ver detalle de post individual
- Eliminar posts propios
- Comentar en posts

### Dashboard
- Ver perfil del usuario
- Estadísticas personales
- Listado de posts propios
- Gestión rápida de contenido

### Administración
- Ver todos los usuarios
- Estadísticas generales
- Gestión de roles
- Monitoreo de actividad

## 🎨 Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Type-safety
- **Tailwind CSS** - Estilos
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas
- **React Icons** - Iconos
- **date-fns** - Manejo de fechas

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación
- Cookies httpOnly
- Validación de inputs
- Middleware de protección de rutas
- Sanitización de datos

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Posts
- `GET /api/posts` - Obtener todos los posts
- `POST /api/posts` - Crear post
- `GET /api/posts/[id]` - Obtener post específico
- `PUT /api/posts/[id]` - Actualizar post
- `DELETE /api/posts/[id]` - Eliminar post

### Comentarios
- `POST /api/comentarios` - Crear comentario

### Admin
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/roles` - Obtener todos los roles
- `POST /api/roles` - Crear rol

## 🚀 Despliegue

Para producción:

```bash
npm run build
npm start
```

## 📄 Licencia

MIT

---

**¡Disfruta usando StackLite!** 🎉
StackLite es una aplicación web modular y ligera diseñada para demostrar cómo construir un sistema completo desde cero, integrando SQL Server como base de datos y diferentes lenguajes de programación para el backend y frontend
