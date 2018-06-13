const express = require('express');
const User = require('./../models/User');

const router = express.Router();

router.post('/', function(req, res, next) {
  if (req.body.email && req.body.password && req.body.passwordConf) {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    };

    User.create(userData, function(err) {
      if (err) {
        res.send(422, err);
        next(err);
      } else {
        res.send('User created');
      }
    });
  }
});

router.put('/', function(req, res, next) {
  if (req.body.email && req.body.password) {
    const userData = {
      email: req.body.email
    };

    User.authenticate(userData, function(err) {
      if (err) {
        res.sendStatus(403);
        return next(err);
      }

      res.send(200, userData);
    });
  }
});

module.exports = router;
