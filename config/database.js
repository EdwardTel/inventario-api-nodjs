
//Configuración de la cadena de conexión a MySQL
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("inventario_db", "root", "edward123*", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
