const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const usersFilePath = path.join(__dirname, '../data/users.json');

// Método para renderizar el formulario de registro
exports.getRegisterForm = (req, res) => {
  res.render('users/register');
};

// Método para manejar el registro de un usuario
exports.registerUser = (req, res) => {
  const { name, email, password, country, conditions } = req.body;
  const profileImage = req.file ? req.file.filename : '';

  if (!conditions) {
    return res.status(400).send('Debes aceptar las condiciones del sitio');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).send('Error al encriptar la contraseña');
    }

    let users = [];
    if (fs.existsSync(usersFilePath)) {
      users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    }

    const newUser = {
      name,
      email,
      password: hashedPassword,
      country,
      profileImage
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.redirect('/users/login');
  });
};

// Método para renderizar el formulario de inicio de sesión
exports.getLoginForm = (req, res) => {
  res.render('users/login');
};

// Método para manejar el inicio de sesión de un usuario
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Por favor, completa todos los campos.');
  }

  let users = [];
  if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
  }

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(401).send('Correo electrónico o contraseña incorrectos.');
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(500).send('Error al comparar la contraseña.');
    }

    if (result) {
      // Aquí puedes establecer la sesión del usuario
      req.session.user = user;
      res.redirect('/users/profile');
    } else {
      res.status(401).send('Correo electrónico o contraseña incorrectos.');
    }
  });
};

// Método para renderizar el perfil del usuario
exports.getProfile = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  res.render('users/profile', { user: req.session.user });
};
