const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const PORT = process.env.PORT || 5000;

const productRoutes = require('./routes/productRoutes');
const usersRouter = require('./routes/usersRouter');
const loginRoutes = require('./routes/auth/login');
const registerRoutes = require('./routes/auth/register');
const cartRoutes = require('./routes/cartRoutes');
const indexRouter = require('./routes/indexRouter');
const userApiRoutes = require('./routes/userApi');
const apiProductsRoutes = require('./routes/apiProducts');
const categoriesApiRoutes = require('./routes/categoriesApi');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuración de middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones **DEBE IR ANTES DE connect-flash**
app.use(session({
    secret: '2751356junior', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Inicializar connect-flash
app.use(flash());

// Middleware para hacer que los mensajes flash estén disponibles en todas las vistas
app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success'); // Esto lo hará disponible en las vistas
    res.locals.user = req.session.userId || null; // Si el usuario está logueado, se guarda su ID en la sesión
    next();
});

// Configuración de method-override
app.use(methodOverride('_method'));

// Rutas
app.use('/products', productRoutes);
app.use('/users', usersRouter);
app.use('/auth/login', loginRoutes);
app.use('/auth/register', registerRoutes);
app.use('/cart', cartRoutes);
app.use('/', indexRouter);
app.use('/api/users', userApiRoutes);
app.use('/api', apiProductsRoutes);
app.use('/api/categories', categoriesApiRoutes);


// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404);
    res.render('error', { message: 'Not Found', error: {} });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Renderiza la página de error
    res.status(err.status || 500);
    res.render('error', { message: res.locals.message, error: res.locals.error });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


module.exports = app;
