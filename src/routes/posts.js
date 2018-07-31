const express = require('express');
const R = require('ramda');

const Post = require('../models/post');
const User = require('../models/user');

const router = express.Router();

router.get('/', function(req, res) {
  Post.find({}, function(err, posts) {
    res.send(posts);
  })
    // .select({title: 1, body: 1, published: 1, author: 1})
    .limit(Number(req.query.limit))
    .skip(Number(req.query.offset));
});

router.get('/:id', function(req, res) {
  Post.findById(req.params.id, function(err, postDetails) {
    User.findOne({email: req.session.user}, function(err, user) {
      if (err) {
        res.send(err);
      }

      if (R.contains(postDetails.id, user.meta.likes)) {
        const data = R.assoc('isLiked', true, postDetails.toObject());

        res.send(data);
      } else {
        res.send(postDetails);
      }
    });
  });
});

router.put('/:id/like', function(req, res) {
  Post.findOneAndUpdate({_id: req.params.id}, {$inc: {'meta.likes': 1}}).then(
    post =>
      User.findOneAndUpdate(
        {email: req.session.user},
        {$push: {'meta.likes': req.params.id}},
        function(err, raw) {
          if (err) {
            res.send(err);
          }

          const data = R.assoc('isLiked', true, post.toObject());

          res.send(data);
        }
      )
  );
});

router.post('/', function(req, res, next) {
  if (!req.session.user) {
    res.status(401).end();

    return;
  }

  const data = Object.assign(req.body, {
    short_description: req.body.body.substring(0, 100),
  });

  Post.create(data, function(err, post) {
    if (err) {
      res.send(422, err);
      next(err);
    } else {
      res.send({id: post.id});
    }
  });
});

module.exports = router;
