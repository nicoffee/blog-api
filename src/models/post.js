const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  picture: String,
  title: String,
  body: String,
  short_description: String,
  published: {type: Date, default: Date.now},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  likes: [{type: String}],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
