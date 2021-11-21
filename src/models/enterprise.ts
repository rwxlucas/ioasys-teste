import { Schema, model } from "mongoose";
import { IEnterpriseModel } from "../utils/types";

const enterpriseSchema = new Schema<IEnterpriseModel>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	actuationField: { type: [String], required: true },
	director: {
		type: [{
			name: String,
			email: String
		}],
		required: true,
		_id: false
	},
	founded: { type: Number },
	employee: {
		type: [{
			userID: String,
			userRole: [String]
		}],
		required: true,
		_id: false
	}
});

const entepriseModel = model<IEnterpriseModel>('enteprise', enterpriseSchema);

export default entepriseModel;