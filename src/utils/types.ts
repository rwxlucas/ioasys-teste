export interface resType {
  status: number;
  response?: {
    message?: string;
    data?: any
  }
}

export interface IUserModel extends Document {
  _doc?: any;
  name: string,
  birthday: string,
  UF: string,
  password: string,
  city: string,
  schooling: string,
  email: string,
  role: string[]
}

export interface IMissingParameters {
  missing: boolean;
  variables?: string;
  user?: IUserModel
}