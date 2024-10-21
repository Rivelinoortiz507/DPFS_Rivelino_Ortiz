// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next(); // El usuario está autenticado, continuar con la siguiente ruta
    }
    res.redirect('/users/login'); // El usuario no está autenticado, redirigir al login
};

// Middleware para las rutas de huéspedes
const isGuest = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/users/profile'); // El usuario está autenticado, redirigir al perfil
    }
    next(); // El usuario no está autenticado, continuar con la siguiente ruta
};

module.exports = { isAuthenticated, isGuest };
