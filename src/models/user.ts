import { Schema, Document, model } from "mongoose";
import { IUserModel } from "../utils/types";

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