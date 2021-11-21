import { Schema, model } from "mongoose";
import { IEnterpriseModel } from "../utils/types";

type IEmployees = {
	userID: string,
	userRole: string
}

const enterpriseSchema = new Schema<IEnterpriseModel>({
	name: { type: String, required: true },
	description: { type: String, required: true },
	actuationField: { type: [String], required: true },
	director: { type: [String], required: true },
	founded: { type: Number },
	employee: {
		type: [{
			userID: String,
			userRole: [String]
		}],
		required: true
	}
});

const entepriseModel = model<IEnterpriseModel>('enteprise', enterpriseSchema);

export default entepriseModel;