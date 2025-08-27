/**
 * @api {post} /api/products Crear producto
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Token JWT del admin.
 *
 * @apiParam {String} lote Número de lote.
 * @apiParam {String} nombre Nombre del producto.
 * @apiParam {Number} precio Precio unitario.
 * @apiParam {Number} cantidad Cantidad disponible.
 *
 * @apiSuccess {Object} product Producto creado.
 *
 * @apiError 401 Token inválido.
 * @apiError 403 Solo admins pueden crear productos.
 */

/**
 * @api {get} /api/products Listar productos
 * @apiName ListProducts
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Token JWT de cualquier usuario autenticado.
 *
 * @apiSuccess {Object[]} products Lista de productos.
 *
 * @apiError 401 Token inválido.
 */

/**
 * @api {put} /api/products/:id Actualizar producto
 * @apiName UpdateProduct
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Token JWT del admin.
 *
 * @apiParam {String} [lote] Número de lote.
 * @apiParam {String} [nombre] Nombre del producto.
 * @apiParam {Number} [precio] Precio unitario.
 * @apiParam {Number} [cantidad] Cantidad disponible.
 *
 * @apiSuccess {Object} product Producto actualizado.
 *
 * @apiError 404 Producto no encontrado.
 * @apiError 401 Token inválido.
 * @apiError 403 Solo admins pueden actualizar.
 */

/**
 * @api {delete} /api/products/:id Eliminar producto
 * @apiName DeleteProduct
 * @apiGroup Products
 *
 * @apiHeader {String} Authorization Token JWT del admin.
 *
 * @apiSuccess {String} message Producto eliminado.
 *
 * @apiError 404 Producto no encontrado.
 * @apiError 401 Token inválido.
 * @apiError 403 Solo admins pueden eliminar.
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middlewares/auth');

// Todas las rutas de productos requieren autenticación
router.use(authenticate);

// CRUD de productos: solo admin puede crear, actualizar y eliminar
router.post('/', authorize('admin'), productController.create);
router.put('/:id', authorize('admin'), productController.update);
router.delete('/:id', authorize('admin'), productController.remove);

// Listado de productos: cualquier usuario autenticado puede ver
router.get('/', productController.list);

module.exports = router;

