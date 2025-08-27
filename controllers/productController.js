const Product = require('../models/Product');

// Crear producto
exports.create = async (req, res, next) => {
  try {
    const { lote, nombre, precio, cantidad } = req.body;

    // Validaciones
    if (!lote || !nombre || precio == null || cantidad == null) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (isNaN(precio) || precio < 0 || isNaN(cantidad) || cantidad < 0) {
      return res.status(400).json({ error: 'Precio y cantidad deben ser números positivos' });
    }

    const product = await Product.create({ 
      lote, 
      nombre, 
      precio, 
      cantidad,
      fechaIngreso: new Date()
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

// Listar productos
exports.list = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

// Actualizar producto
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lote, nombre, precio, cantidad } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    // Validaciones
    if (!lote || !nombre || precio == null || cantidad == null) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (isNaN(precio) || precio < 0 || isNaN(cantidad) || cantidad < 0) {
      return res.status(400).json({ error: 'Precio y cantidad deben ser números positivos' });
    }

    await product.update({ lote, nombre, precio, cantidad });
    res.json({ message: 'Producto actualizado', product });
  } catch (err) { next(err); }
};

// Eliminar producto
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await product.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (err) { next(err); }
};
