const jwt = require('jsonwebtoken');

const generateToken = (userId, userType, companyId = null) => {
  const token = jwt.sign(
    {
      id: userId,
      userType,
      companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    }
  );
  return token;
};

const generateRefreshToken = (userId) => {
  const token = jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    }
  );
  return token;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};
