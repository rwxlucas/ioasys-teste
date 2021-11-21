import { IUserModel } from '../models/user';

export interface resType {
  status: number;
  response?: {
    message?: string;
    data?: any
  }
}

export interface IMissingParameters {
  missing: boolean;
  variables?: string;
  user?: IUserModel
}