const express = require("express");
const Post = require("./../models/Post");

const router = express.Router();

router.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    const postMap = {};

    posts.forEach(function(post) {
      postMap[post._id] = post;
    });

    res.send(postMap);
  });
});

module.exports = router;
