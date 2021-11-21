import { IEnterpriseModel, resType } from "../utils/types";
import { makeResponse, verifyObjectRequest } from "../utils/utils";
import Enterprise from '../models/enterprise';

const signUp = async (body: IEnterpriseModel): Promise<resType> => {
	try {
		const verifyRequest = verifyObjectRequest(body, ['name', 'description', 'actuationField', 'director', 'founded']);
		if (verifyRequest.missing) return makeResponse(404, { message: verifyRequest.variables });
		const { name, description, actuationField, director, founded } = body;
		const enterprise = await Enterprise.findOne({ name });
		if (enterprise) return makeResponse(409, { message: 'Enteprise already exists' });
		const newEnteprise = new Enterprise({
			name,
			description,
			actuationField,
			director,
			founded,
			employee: []
		});
		await newEnteprise.save();
		return makeResponse(200, { message: 'Enterprise created', data: newEnteprise.id });
	} catch (error: any) {
		console.log(error);
		return makeResponse(500, { message: error.message });
	}
}

export default {
	signUp
}