import { Schema, Document, model } from "mongoose";

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

const userSchema = new Schema<IUserModel>({
	name: { type: String, required: true },
	birthday: { type: String, required: true },
	UF: { type: String, required: true },
	password: { type: String, required: true },
	city: { type: String, required: true },
	schooling: { type: String, required: true },
	email: { type: String, required: true },
	role: { type: [String], required: true }
});

const userModel = model<IUserModel>('user', userSchema);

export default userModel;