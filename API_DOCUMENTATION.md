# API Endpoints - StackLite

Documentación completa de todos los endpoints disponibles en la API.

## 🔗 Base URL
```
http://localhost:3000/api
```

## 🔐 Autenticación
La mayoría de los endpoints requieren autenticación mediante JWT. El token se envía como cookie httpOnly.

---

## 📁 Archivos

### `POST /api/archivos`
Crear un nuevo archivo

**Request Body:**
```json
{
  "ruta": "/uploads/documento.pdf",
  "tipo": "application/pdf",
  "id_post": 1
}
```

### `GET /api/archivos`
Obtener todos los archivos

### `GET /api/archivos/{id}`
Obtener archivo por ID

### `DELETE /api/archivos/{id}`
Eliminar archivo (requiere autenticación)

### `GET /api/archivos/post/{idPost}`
Obtener archivos de un post específico

---

## 💬 Comentarios

### `POST /api/comentarios`
Crear un nuevo comentario (requiere autenticación)

**Request Body:**
```json
{
  "id_post": 1,
  "id_usuario": 1,
  "texto": "Excelente post!"
}
```

### `GET /api/comentarios`
Obtener todos los comentarios

### `GET /api/comentarios/{id}`
Obtener comentario por ID

### `PUT /api/comentarios/{id}`
Actualizar comentario (requiere autenticación)

**Request Body:**
```json
{
  "texto": "Texto actualizado"
}
```

### `DELETE /api/comentarios/{id}`
Eliminar comentario (requiere autenticación)

### `GET /api/comentarios/post/{idPost}`
Obtener comentarios de un post específico

---

## 📝 Posts

### `POST /api/posts`
Crear un nuevo post (requiere autenticación)

**Request Body:**
```json
{
  "titulo": "Mi nuevo post",
  "contenido": "Contenido del post...",
  "id_usuario": 1
}
```

### `GET /api/posts`
Obtener todos los posts con paginación

**Query Parameters:**
- `limit` (opcional): Número de posts por página (default: 20)
- `offset` (opcional): Desplazamiento (default: 0)

### `GET /api/posts/{id}`
Obtener post por ID (incluye comentarios y archivos)

### `PUT /api/posts/{id}`
Actualizar post (requiere autenticación)

**Request Body:**
```json
{
  "titulo": "Título actualizado",
  "contenido": "Contenido actualizado"
}
```

### `DELETE /api/posts/{id}`
Eliminar post (requiere autenticación, elimina en cascada)

### `GET /api/posts/usuario/{idUsuario}`
Obtener posts de un usuario específico

---

## 🛡️ Roles

### `POST /api/roles`
Crear un nuevo rol (requiere autenticación)

**Request Body:**
```json
{
  "nombre_rol": "Moderador",
  "descripcion": "Usuario con permisos de moderación"
}
```

### `GET /api/roles`
Obtener todos los roles (requiere autenticación)

### `GET /api/roles/{id}`
Obtener rol por ID

### `PUT /api/roles/{id}`
Actualizar rol (requiere autenticación)

**Request Body:**
```json
{
  "nombre_rol": "Administrador",
  "descripcion": "Usuario con permisos completos"
}
```

### `DELETE /api/roles/{id}`
Eliminar rol (requiere autenticación, elimina relaciones en cascada)

---

## 👥 Usuarios

### `POST /api/usuarios`
Ver endpoint de registro: `POST /api/auth/registro`

### `GET /api/usuarios`
Obtener todos los usuarios con estadísticas (requiere autenticación)

### `GET /api/usuarios/{id}`
Obtener usuario por ID (incluye roles y estadísticas)

### `PUT /api/usuarios/{id}`
Actualizar usuario (requiere autenticación)

**Request Body:**
```json
{
  "nombre": "Nuevo nombre",
  "email": "nuevo@email.com"
}
```

### `DELETE /api/usuarios/{id}`
Eliminar usuario (requiere autenticación, elimina en cascada todos los datos relacionados)

### `GET /api/usuarios/{id}/roles`
Obtener roles asignados al usuario

### `POST /api/usuarios/{id}/roles`
Asignar rol a usuario (requiere autenticación)

**Request Body:**
```json
{
  "id_rol": 2
}
```

---

## 🔐 Autenticación

### `POST /api/auth/registro`
Registrar nuevo usuario

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "contraseña": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "email": "juan@email.com",
    "fecha_registro": "2025-12-14T10:00:00.000Z"
  }
}
```

### `POST /api/auth/login`
Iniciar sesión

**Request Body:**
```json
{
  "email": "juan@email.com",
  "contraseña": "password123"
}
```

### `POST /api/auth/logout`
Cerrar sesión

---

## ❤️ Health Check

### `GET /api/health`
Verificar estado del servidor

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-14T10:00:00.000Z",
  "service": "StackLite API",
  "version": "1.0.0",
  "database": "Connected"
}
```

---

## 📊 Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Solicitud incorrecta
- `401` - No autenticado
- `404` - No encontrado
- `500` - Error del servidor
- `503` - Servicio no disponible

## 🔒 Seguridad

- Todos los endpoints de escritura (POST, PUT, DELETE) requieren autenticación
- Las contraseñas se almacenan hasheadas con bcrypt
- JWT con expiración de 7 días
- Cookies httpOnly para prevenir XSS
- Validación de inputs en todos los endpoints
