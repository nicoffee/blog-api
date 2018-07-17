const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.get('/', function(req, res) {
  Post.find({}, function(err, posts) {
    res.send(posts);
  });
});

router.get('/:id', function(req, res) {
  Post.findById(req.params.id, function(err, postDetails) {
    res.send(postDetails);
  });
});

router.post('/', function(req, res, next) {
  Post.create(req.body, function(err) {
    if (err) {
      res.send(422, err);
      next(err);
    } else {
      res.send(req.body);
    }
  });
});

module.exports = router;
