const express = require('express');
const R = require('ramda');
const Post = require('../models/post');

const router = express.Router();

router.get('/', (req, res) => {
  const query = req.query.search
    ? {title: {$regex: req.query.search, $options: 'i'}}
    : {};

  Post.find(query, (err, posts) => {
    res.send(posts);
  })
    // .select({title: 1, body: 1, published: 1, author: 1})
    .limit(Number(req.query.limit))
    .skip(Number(req.query.offset));
});

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .populate('author')
    .then(postDetails => {
      let data = postDetails.toObject();

      if (!req.session.user) {
        res.send(data);
        return;
      }

      if (postDetails.author.id === req.session.user._id) {
        data = R.assoc('canEdit', true, data);
      } else {
        data = R.assoc('canEdit', false, data);
      }

      if (R.contains(req.session.user._id, postDetails.likes)) {
        data = R.assoc('isLiked', true, data);
      } else {
        data = R.assoc('isLiked', false, data);
      }

      res.send(data);
    })
    .catch(err => {
      res.send(err);
    });
});

router.post('/', (req, res, next) => {
  if (!req.session.user) {
    res.status(401).end();

    return;
  }

  const data = Object.assign(req.body, {
    author: req.session.user,
    short_description: req.body.body.substring(0, 100),
  });

  Post.create(data, (err, post) => {
    if (err) {
      res.send(422, err);
      next(err);
    } else {
      res.send({id: post.id});
    }
  });
});

router.patch('/:id', (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(post => {
      res.send(post);
    })
    .catch(err => {
      res.send(err);
    });
});

router.put('/:id/like', (req, res) => {
  const isLike = req.body.like;

  const update = isLike
    ? {$push: {likes: req.session.user._id}}
    : {$pull: {likes: req.session.user._id}};

  Post.findByIdAndUpdate(req.params.id, update, {new: true})
    .then(post => {
      const data = R.assoc('isLiked', isLike, post.toObject());

      res.send(data);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
