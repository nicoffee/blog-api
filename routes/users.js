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

      console.log('User', userData);
    });
  }

  res.send('respond with a resource');
});

module.exports = router;
