const jwt = require('jsonwebtoken');
const config = require('./config/config.json');

const verifyToken = async (req, res, next) => {
  const authHeaderValue = req.headers['x-access-token'] || req.headers['authorization'];

  if (authHeaderValue) {
    const authToken = authHeaderValue.replace(/Bearer /gim, '');

    jwt.verify(authToken, config['authSecret'], (err, decoded) => {
      if (err) {
        return res.json({
          code: 'ERR_AUTH_TOKEN_EXPIRED',
          message: 'Auth token expired'
        });
      }

      req.decoded = decoded;
      req.currentUser = {
        id: decoded.id,
        password: decoded.password,
        accessToken: authToken
      };

      next();
    });
  } else {
    return res.json({
      code: 'ERR_UNATHORIZED',
      message: 'Auth token is not provided'
    });
  }
};

module.exports = {
  verifyToken
};
