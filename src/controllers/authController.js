const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Verificar se o email e senha foram fornecidos
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }
      
      // Buscar o usuário pelo email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar se a senha está correta
      const passwordMatch = await user.checkPassword(password);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }
      
      // Verificar se o usuário é admin
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
      }
      
      // Gerar token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      });
      
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        },
        token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro no login' });
    }
  }
};
