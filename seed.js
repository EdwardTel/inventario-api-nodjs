//Crear usuarios y productos de prueba

const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/Product");
const sequelize = require("./config/database"); 

async function seed() {
  try {
    // sincronizar tablas
    await sequelize.sync();

    // --- Admin ---
    const adminEmail = "admin@local.com";
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = await User.create({
        name: "admin",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin creado:", {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      });
    } else {
      console.log("El usuario admin ya existe.");
    }

    // --- Clientes de prueba ---
    const testUsers = [
      { name: "cliente1", email: "cliente1@local.com", password: "cliente123" },
      { name: "cliente2", email: "cliente2@local.com", password: "cliente123" },
      { name: "cliente3", email: "cliente3@local.com", password: "cliente123" },
    ];

    for (const u of testUsers) {
      const existingUser = await User.findOne({ where: { email: u.email.toLowerCase() } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        const user = await User.create({
          name: u.name,
          email: u.email.toLowerCase(),
          password: hashedPassword,
          role: "client",
        });
        console.log("Cliente creado:", {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        console.log(`El usuario ${u.email.toLowerCase()} ya existe.`);
      }
    }

    // --- Productos de prueba ---
    const products = [
      { lote: "E001", nombre: "Teclado mecánico", precio: 120, cantidad: 50 },
      { lote: "E002", nombre: "Mouse gamer", precio: 80, cantidad: 60 },
      { lote: "E003", nombre: "Auriculares inalámbricos", precio: 150, cantidad: 40 },
      { lote: "E004", nombre: "Webcam HD", precio: 90, cantidad: 30 },
      { lote: "E005", nombre: "Almohadilla para mouse", precio: 25, cantidad: 100 },
    ];

    for (const p of products) {
      const existingProduct = await Product.findOne({ where: { nombre: p.nombre } });
      if (!existingProduct) {
        const product = await Product.create(p);
        console.log("Producto creado:", product.nombre);
      } else {
        console.log(`El producto ${p.nombre} ya existe.`);
      }
    }

    console.log("Seed completado.");
    process.exit(0);
  } catch (error) {
    console.error("Error al ejecutar seed:", error);
    process.exit(1);
  }
}

seed();


