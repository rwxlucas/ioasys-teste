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

export interface IUserModel extends Document {
  id?: string;
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

export interface IEnterpriseModel extends Document {
  id?: string;
  _doc?: any;
  name: string,
  description: string;
  actuationField: string[];
  director: string[];
  founded: number;
  employee: {
    userID: string;
    userRole: string[];
  }[];
}