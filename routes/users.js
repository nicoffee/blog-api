const express = require('express');
const User = require('./../models/User');
const {check, validationResult} = require('express-validator/check');

const router = express.Router();

router.post(
  '/',
  [
    check('email').isEmail(),
    check('password')
      .isLength({min: 8})
      .custom((value, {req}) => {
        if (value !== req.body.passwordConf) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
  ],
  function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.mapped()});
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    };

    User.create(userData, function(err) {
      if (err) {
        res.send(422, err);
        next(err);
      } else {
        res.send({email: userData.email});
      }
    });
  }
);

router.put('/', function(req, res, next) {
  if (req.body.email && req.body.password) {
    const userData = {
      email: req.body.email,
    };

    User.authenticate(userData, function(err) {
      if (err) {
        res.sendStatus(403);
        return next(err);
      }

      req.session.user = userData.email;
      res.send(200, userData);
    });
  }
});

module.exports = router;
