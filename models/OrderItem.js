const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Order = require('./Order');

const OrderItem = sequelize.define('OrderItem', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, { tableName: 'order_items' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

module.exports = OrderItem;