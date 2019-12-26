const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const config = require('../config/config.json');

const User = require('../models').User;
const Auth = require('../models').Auth;

const router = express.Router();

router.get('/:refreshToken', async (req, res) => {
  const { refreshToken } = req.params;

  const userAuth = await Auth.findOne({
    where: {
      refreshToken
    }
  });

  if (userAuth) {
    const user = await User.findOne({
      where: {
        username: userAuth.username
      }
    }).then(res => JSON.parse(JSON.stringify(res)));

    const tokens = generateTokens(user);

    if (tokens) {
      await userAuth.update({
        refreshToken
      });

      res.status(200).json({
        accessToken: `Bearer ${tokens.accessToken}`,
        refreshToken: tokens.refreshToken,
        expiresIn: moment(Date.now()).add(10, 'min')
      });
    } else {
      return res.status(500).json({
        code: 'ERR_SERVER_ERROR',
        message: 'Unexpected server error'
      });
    }
  } else {
    return res.status(500).json({
      code: 'ERR_SERVER_ERROR',
      message: 'Unexpected server error'
    });
  }
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({
      code: 'ERR_USER_NOT_FOUND',
      message: 'The User\'s not found'
    });
  }

  const userAuth = await Auth.findOne({
    where: {
      username
    }
  });

  bcrypt.compare(password, user.password)
    .then((isMatch) => {
      if (isMatch) {
        const { username, password } = user;
        const foundUser = {
          username,
          password
        };

        const tokens = generateTokens(foundUser);

        if (tokens) {
          if (userAuth) {
            userAuth.update({
              refreshToken: tokens.refreshToken
            });
          } else {
            Auth.create({
              username,
              refreshToken: tokens.refreshToken
            });
          }

          res.status(200).json({
            accessToken: `Bearer ${tokens.accessToken}`,
            refreshToken: tokens.refreshToken,
            expiresIn: moment(Date.now()).add(10, 'min')
          });
        }
      } else {
        return res.status(400).json({
          code: 'ERR_INVALID_PASSWORD',
          message: 'The password is invalid'
        });
      }
    });
});

module.exports = router;

function generateTokens (user) {
  const accessToken = jwt.sign(
    user,
    config['authSecret'],
    {expiresIn: '10m'}
  );

  const refreshToken = jwt.sign(
    user,
    config['authRefreshSecret'],
    {expiresIn: 86400}
  );

  return { accessToken, refreshToken };
}
