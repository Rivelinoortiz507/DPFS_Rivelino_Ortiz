const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const upload = require('../config/upload'); 

router.get('/register', usersController.getRegisterForm);
router.post('/register', upload.single('profileImage'), usersController.registerUser);
router.get('/login', usersController.getLoginForm);
router.post('/login', usersController.loginUser);
router.get('/profile', usersController.getProfile);

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error al cerrar sesión.');
      }
      res.redirect('/users/login');
    });
  });
    

module.exports = router;
