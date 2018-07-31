const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  picture: String,
  title: String,
  body: String,
  short_description: String,
  published: {type: Date, default: Date.now},
  author: {id: String, name: String},
  meta: {
    likes: {type: Number, default: 0},
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
