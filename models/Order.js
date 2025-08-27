const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
}, { tableName: 'orders' });

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;