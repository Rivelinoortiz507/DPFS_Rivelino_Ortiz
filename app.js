const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');

// Importar rutas
const productRoutes = require('./routes/products');
const cartRouter = require('./routes/cart');
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuración de middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Configuración de session
app.use(session({
  secret: 'your-secret-key', // Cambia esto por una clave secreta más segura
  resave: false,
  saveUninitialized: true
}));

// Configuración de method-override
app.use(methodOverride('_method'));

// Rutas
app.use('/products', productRoutes);
app.use('/users', usersRouter);
app.use('/auth', loginRoutes);
app.use('/auth', registerRoutes);
app.use('/', cartRouter);
app.use('/', indexRouter);

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
