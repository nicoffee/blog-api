import * as express from 'express';
import * as session from 'express-session';

import * as connectMongo from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import cors from 'cors';
import * as mongoose from 'mongoose';
// const favicon = require('serve-favicon');
import * as logger from 'morgan';
import * as path from 'path';

import indexRouter from './routes/index';
import logoutRouter from './routes/logout';
import postsRouter from './routes/posts';
import sessionRouter from './routes/session';
import usersRouter from './routes/users';

// import {Error} from './definition';

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

mongoose.connect(
  url,
  {useNewUrlParser: true}
);

const app = express();
const MongoStore = connectMongo(session);

app.use(cookieParser());

app.use(
  session({
    cookie: {
      maxAge: 86400000,
      secure: false,
    },
    resave: false,
    saveUninitialized: false,
    secret: 'secret', // process.env.SESSION_SECRET ||
    store: new MongoStore({
      collection: 'sessions',
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use(cors({credentials: true, origin: true}));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/logout', logoutRouter);
app.use('/session', sessionRouter);

app.use((req, res, next) => {
  // interface Error {
  //   status?: number;
  // }

  let err: any;
  err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use((err, req, res) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
// });

module.exports = app;
