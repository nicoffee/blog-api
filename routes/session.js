const express = require('express');

const router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.user) {
    res.send(200, req.session.user);
  } else {
    res.send(401);
    next();
  }
});

module.exports = router;
