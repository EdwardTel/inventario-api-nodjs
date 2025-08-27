/**
 * @api {post} /api/orders Crear orden
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiHeader {String} Authorization Token JWT del cliente.
 *
 * @apiParam {Object[]} items Lista de productos a comprar.
 * @apiParam {Number} items.productId ID del producto.
 * @apiParam {Number} items.cantidad Cantidad a comprar.
 *
 * @apiSuccess {String} message Orden creada.
 * @apiSuccess {Number} orderId ID de la orden.
 *
 * @apiError 400 No se proporcionaron items.
 * @apiError 401 Token inválido.
 * @apiError 403 Solo clientes pueden crear órdenes.
 * @apiError 500 Error interno (stock insuficiente u otro).
 */

/**
 * @api {get} /api/orders Listar órdenes
 * @apiName ListOrders
 * @apiGroup Orders
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiSuccess {Object[]} orders Lista de órdenes.
 * @apiSuccess {Number} orders.id ID de la orden.
 * @apiSuccess {Date} orders.fecha Fecha de creación.
 * @apiSuccess {Object} orders.cliente Información del cliente.
 * @apiSuccess {Number} orders.total Total de la orden.
 * @apiSuccess {Object[]} orders.items Productos comprados.
 * @apiSuccess {Object} orders.items.product Información del producto.
 * @apiSuccess {Number} orders.items.cantidad Cantidad comprada.
 * @apiSuccess {Number} orders.items.precioUnitario Precio unitario del producto.
 *
 * @apiError 401 Token inválido.
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

// Crear orden: solo clientes
router.post('/', authorize('client'), orderController.createOrder);

// Listar órdenes: admins ven todas, clientes solo las propias
router.get('/', orderController.listOrders);

// Ver factura de una orden específica
router.get('/:id', orderController.getOrderById);

module.exports = router;

