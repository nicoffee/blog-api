const express = require('express');
const User = require('../models/user');
const {check, validationResult} = require('express-validator/check');

const router = express.Router();

router.post(
  '/',
  [
    check('email').isEmail(),
    check('password')
      .isLength({min: 8})
      .custom((value, {req}) => {
        if (value !== req.body.password_confirm) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.mapped()});
    }

    const userData = {
      email: req.body.email,
      password: req.body.password,
    };

    User.create(userData, (err, user) => {
      if (err) {
        res.status(422).send(err);
        next(err);
      } else {
        req.session.user = user;
        res.send({email: userData.email});
      }
    });
  }
);

router.put('/', (req, res, next) => {
  if (req.body.email && req.body.password) {
    const userData = req.body;

    User.authenticate(userData, (err, user) => {
      if (err) {
        res.status(err.status).send({message: err.message});
        return next(err);
      }

      req.session.user = user;
      res.status(200).send({email: user.email});
    });
  }
});

module.exports = router;
