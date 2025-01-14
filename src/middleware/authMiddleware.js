const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_WORD = process.env.JWT_SECRET_KEY;

const { findById } = require('../services/usersService');

const authMiddleware = (req, res, next) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  const [_, token] = auth.split(' ');

  jwt.verify(token, SECRET_WORD, async (err, decoded) => {
    const user = await findById(decoded?.id);

    try {
      if (err || !user || !user.token || user.token !== token) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  });
};

module.exports = authMiddleware;
