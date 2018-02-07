var express = require('express');
var router = express.Router();
var insertNotes = require('./../createDb.js');

/* GET users listing. */
router.get('/notes', function(req, res, next) {
  res.send({ note: 'Watch TV' });
});

module.exports = router;
