const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    res.status(200).send({email: req.session.user});
  } else {
    res.status(401).end();
  }
});

module.exports = router;
