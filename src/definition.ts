import {Request} from 'express';

export interface IGetUserAuthInfoRequest extends Request {
  session?: any;
}

export interface Error {
  status?: number;
}
