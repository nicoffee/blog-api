const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // likes: [{type: String}],
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
});

UserSchema.statics.authenticate = function(userData, callback) {
  User.findOne({email: userData.email})
    // .populate('posts')
    .exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        const err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }

      bcrypt.compare(userData.password, user.password, (err, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          const err = new Error('Password incorrect');
          err.status = 401;
          return callback(err);
        }
      });
    });
};

UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
