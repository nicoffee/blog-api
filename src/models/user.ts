import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

interface IUser {
  password: any; // Actually should be something like `multer.Files`
}

const UserSchema = new mongoose.Schema({
  email: {
    required: true,
    trim: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  // likes: [{type: String}],
  posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
});

UserSchema.statics.authenticate = (userData, callback) => {
  User.findOne({email: userData.email}).exec((findUserErr, user: IUser) => {
    if (findUserErr) {
      return callback(findUserErr);
    } else if (!user) {
      let err: any;
      err = new Error('User not found');
      err.status = 401;
      return callback(err);
    }

    bcrypt.compare(
      userData.password,
      user.password,
      (bcryptCompareErr, result) => {
        if (bcryptCompareErr) {
          return callback(bcryptCompareErr);
        }

        if (result === true) {
          return callback(null, user);
        } else {
          let err: any;
          err = new Error('Password incorrect');
          err.status = 401;
          return callback(err);
        }
      }
    );
  });
};

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

export default User;
