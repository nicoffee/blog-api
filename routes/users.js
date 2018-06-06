const express = require('express');
const User = require('./../models/User');

const router = express.Router();

router.post('/', function(req, res, next) {
  if (
    req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf
  ) {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf
    };

    // kitty.save().then(() => console.log('meow'));

    User.create(userData, function(err) {
      if (err) {
        return next(err);
      }
    });
  }

  res.send('respond with a resource');
});

router.put('/', function(req, res, next) {
  if (req.body.email && req.body.password) {
    const userData = {
      email: req.body.email,
      username: req.body.username
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
