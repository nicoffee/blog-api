import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  body: String,
  likes: [{type: String}],
  picture: String,
  published: {type: Date, default: Date.now},
  short_description: String,
  title: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
