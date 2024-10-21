module.exports = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/users/profile'); // Redirige si ya está autenticado
    }
    next();
};