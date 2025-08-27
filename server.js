//Punto de entrada de la app

const express = require('express');
const app = express();

const sequelize = require('./config/database'); 
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');


app.use(express.json());
app.use(errorHandler);
app.use(morgan('dev'));
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// error handler simple
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}).catch(err => console.error('DB connection error', err));