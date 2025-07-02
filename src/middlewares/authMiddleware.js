const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    // Formato do header: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Erro no formato do token' });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' });
    }
    
    // Verificar se o token é válido
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token inválido' });
      }
      
      // Verificar se o usuário existe e é admin
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      
      if (!user.isAdmin) {
        return res.status(403).json({ error: 'Acesso restrito a administradores' });
      }
      
      // Adicionar o ID do usuário ao request para uso posterior
      req.userId = decoded.id;
      
      return next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro na autenticação' });
  }
};
