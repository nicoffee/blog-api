import * as express from 'express';
import {IGetUserAuthInfoRequest} from '../definition';
const router = express.Router();

router.get('/', (req: IGetUserAuthInfoRequest, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return next(err);
      } else {
        return res.end();
      }
    });
  }
});

module.exports = router;
