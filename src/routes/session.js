const express = require('express');

const router = express.Router();

router.get('/', function(req, res) {
  if (req.session.user) {
    res.status(200).send({email: req.session.user});
  } else {
    res.status(401).end();
  }
});

module.exports = router;
