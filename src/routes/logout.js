const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      } else {
        return res.end();
      }
    });
  }
});

module.exports = router;
