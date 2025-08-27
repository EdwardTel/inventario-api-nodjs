const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const User = require('../models/User');
const sequelize = require('../config/database');

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body; // [{ productId, cantidad }]
    if (!items || !items.length) return res.status(400).json({ error: 'No items provided' });

    let total = 0;

    // Calcular total y validar stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.cantidad < item.cantidad) throw new Error(`Not enough stock for ${product.nombre}`);
      total += product.precio * item.cantidad;
    }

    // Crear la orden
    const order = await Order.create(
      { userId: req.user.id, total },
      { transaction: t }
    );

    // Crear items y actualizar stock
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        cantidad: item.cantidad,
        precioUnitario: product.precio
      }, { transaction: t });

      await product.update({ cantidad: product.cantidad - item.cantidad }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ message: 'Order created', orderId: order.id });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    // Admin ve todas, cliente solo las propias
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };

    const orders = await Order.findAll({
      where,
      include: [
        { model: User, attributes: ['id','name','email'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id','nombre'] }]
        }
      ],
      order: [['createdAt','DESC']]
    });

    const result = orders.map(order => ({
      id: order.id,
      fecha: order.createdAt,
      cliente: order.User,
      total: order.total,
      items: order.OrderItems.map(i => ({
        product: i.Product,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario
      }))
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'name email') // datos del cliente
      .populate('products.product', 'name price'); // detalles de productos

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Si es cliente, solo puede ver sus propias órdenes
    if (req.user.role === 'client' && order.client._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Calcular total
    const total = order.products.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    res.json({
      id: order._id,
      fecha: order.createdAt,
      cliente: order.client,
      productos: order.products.map(p => ({
        nombre: p.product.name,
        cantidad: p.quantity,
        precioUnitario: p.product.price,
        subtotal: p.quantity * p.product.price
      })),
      total: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

