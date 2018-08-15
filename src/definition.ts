import {Request} from 'express';

export interface IGetUserAuthInfoRequest extends Request {
  session?: any;
}

export interface IError {
  status?: number;
}
