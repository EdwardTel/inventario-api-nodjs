/**
 * @api {post} /api/users/register Registrar usuario
 * @apiName RegisterUser
 * @apiGroup Users
 *
 * @apiParam {String} name Nombre del usuario.
 * @apiParam {String} email Email del usuario.
 * @apiParam {String} password Contraseña del usuario.
 * @apiParam {String} [role="client"] Rol del usuario: "admin" o "client".
 *
 * @apiSuccess {Object} user Información del usuario creado.
 * @apiSuccess {String} token JWT de autenticación.
 *
 * @apiError 400 Campos faltantes.
 * @apiError 409 Email ya registrado.
 */

/**
 * @api {post} /api/users/login Login de usuario
 * @apiName LoginUser
 * @apiGroup Users
 *
 * @apiParam {String} email Email del usuario.
 * @apiParam {String} password Contraseña del usuario.
 *
 * @apiSuccess {Object} user Información del usuario.
 * @apiSuccess {String} token JWT.
 *
 * @apiError 400 Campos faltantes.
 * @apiError 401 Credenciales inválidas.
 */

/**
 * @api {get} /api/users Listar usuarios
 * @apiName ListUsers
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Token JWT del admin.
 *
 * @apiSuccess {Object[]} users Lista de usuarios.
 *
 * @apiError 401 Token inválido.
 * @apiError 403 Solo admins pueden ver usuarios.
 */

/**
 * @api {put} /api/users/:id Actualizar usuario
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Token JWT del admin.
 *
 * @apiParam {String} [name] Nombre del usuario.
 * @apiParam {String} [email] Email del usuario.
 * @apiParam {String} [role] Rol: "admin" o "client".
 *
 * @apiSuccess {String} message Mensaje de confirmación.
 * @apiSuccess {Object} user Usuario actualizado.
 *
 * @apiError 404 Usuario no encontrado.
 * @apiError 401 Token inválido.
 * @apiError 403 Solo admins pueden actualizar.
 */

/**
 * @api {delete} /api/users/:id Eliminar usuario
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Token JWT del admin.
 *
 * @apiSuccess {String} message Mensaje de confirmación.
 *
 * @apiError 404 Usuario no encontrado.
 * @apiError 401 Token inválido.
 * @apiError 403 Solo admins pueden eliminar.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');

// Registro y login
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas
router.get('/', authenticate, authorize('admin'), userController.list);
router.put('/:id', authenticate, authorize('admin'), userController.update);
router.delete('/:id', authenticate, authorize('admin'), userController.remove);

module.exports = router;

