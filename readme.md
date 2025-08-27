# Inventario API

API para la gestión de usuarios, productos y compras en un inventario.

## Descripción

Este software implementa un sistema básico con roles de **Administrador** y **Cliente**:

- Registro y login de usuarios (admin / clientes).
- CRUD de usuarios (solo admin)
- CRUD de productos (solo admin).
- Creación de órdenes (clientes pueden agregar uno o varios productos por cada orden).
- Visualización de facturas y detalle de compras.
- Historial de compras para clientes.
- Listado de órdenes para administradores (pueden ver todas las ordenes) y clientes (solo ven las propias).

---

## Tecnologías

- Node.js
- Express
- Sequelize (MySQL / PostgreSQL compatible)
- JWT para autenticación
- bcryptjs para hash de contraseñas
- morgan para logs
- apidoc para documentación

---

## Instalación

1. Clona el repositorio:

- git clone <TU_REPOSITORIO>
- cd inventario-api

2. Instala dependencias:

- `npm install`

Configura variables de entorno (opcional, por defecto se usan valores internos en database.js y auth.js):

- JWT_SECRET=mi_super_secreto
- JWT_EXPIRES_IN=7d
- DB_HOST=localhost
- DB_USER=root
- DB_PASS=password
- DB_NAME=inventario
- DB_DIALECT=mysql
- PORT=3000

3. Sincroniza base de datos y agrega datos iniciales (opcional ejecutando seed.js):

- `node seed.js`

Esto creará:

- 1 admin (admin@local.com / admin123)

- 3 clientes (cliente1@local.com, cliente2@local.com, etc.)

- 5 productos de ejemplo

4. Ejecutar servidor
- `npm start`

O con nodemon:
- `nodemon server.js`

El servidor escuchará en http://localhost:3000. (o según tu configuración)

---

## Uso de la API
1. Usuarios

**Registrar usuario**
- POST /api/users/register
- Body JSON:
```
{
  "name": "cliente4",
  "email": "cliente4@local.com",
  "password": "cliente123",
  "role": "client"
}
```
**Login**
- POST /api/use- rs/login
Body JSON:
```
{
  "email": "admin@local.com",
  "password": "admin123"
}
```

**Response incluirá un token para usar en Authorization header**

**Listar usuarios (solo admin)**
- GET /api/users
- Headers: Authorization: Bearer <TOKEN_ADMIN>

**Actualizar usuario (solo admin)**
- PUT /api/users/:id
- Headers: Authorization: Bearer <TOKEN_ADMIN>
- Body JSON con campos a modificar.

**Eliminar usuario (solo admin)**
- DELETE /api/users/:id
- Headers: Authorization: Bearer <TOKEN_ADMIN>

2. Productos

**Crear producto (solo admin)**
- POST /api/products
- Headers: Authorization: - Bearer <TOKEN_ADMIN>
- Body JSON:
```
{
  "lote": "L001",
  "nombre": "Producto1",
  "precio": 100,
  "cantidad": 50
}
```

**Listar productos (cliente y admin)**
- GET /api/products
- Headers: Authorization: Bearer <TOKEN_CLIENT o TOKEN_ADMIN>

**Actualizar producto (solo admin)** 
- PUT /api/products/:id
- Headers: Authorization: Bearer <TOKEN_ADMIN>
- Body JSON con campos a modificar.

**Eliminar producto (solo admin)**
- DELETE /api/products/:id
- Headers: Authorization: Bearer <TOKEN_ADMIN>

3. Órdenes

**Crear orden (Cliente)**
- POST /api/orders
- Headers: Authorization: Bearer <TOKEN_CLIENT>
- Body JSON:
```
{
  "items": [
    { "productId": 1, "cantidad": 2 },
    { "productId": 2, "cantidad": 1 }
  ]
}
```
**Listar órdenes**
- GET /api/orders
- Headers: Authorization: Bearer <TOKEN>

**Admin ve todas**
**Cliente ve solo las propias**

## Logs y errores

- Se usan logs con morgan (dev) para ver solicitudes HTTP en consola.
- Todos los errores pasan por middleware de captura de errores para unificar respuesta.

## Validaciones y seguridad

- JWT asegura autenticación y autorización.
- Hash de contraseñas con bcrypt.
- Middleware authorize limita endpoints según rol (admin / client).
- Validaciones básicas de existencia de campos y tipos de datos.

## Documentación con apidoc

Instalar apidoc:
- `npm install -g apidoc`

Generar documentación:
- `npm run apidoc`

Abrir en el navegador:
- `docs/api/index.html`

La documentación incluye todas las rutas: usuarios, productos, órdenes.

## Estructura de carpetas
- /controllers   -> Lógica de negocio
- /models        -> Modelos Sequelize
- /routes        -> Rutas de la API
- /middlewares   -> Autenticación, autorización y logs
- /config        -> Conexión a la base de datos
- /seed.js       -> Datos iniciales
- /server.js     -> Servidor principal
- /docs/api      -> Documentación generada por apidoc

