const express = require('express');
const router = express.Router();

const fakeUser = {
  email: 'admin@hellsmile.com',
  password: '123456',
  role: 'admin'
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === fakeUser.email && password === fakeUser.password) {
    return res.status(200).json({
      message: 'Login bem-sucedido',
      token: 'fake-jwt-token',
      role: fakeUser.role
    });
  }

  return res.status(401).json({ message: 'Credenciais inválidas' });
});

module.exports = router;
