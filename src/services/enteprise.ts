import { resType } from "../utils/types";
import { IEnterpriseModel } from '../models/enterprise';
import { makeResponse, verifyObjectRequest, verifyEmail } from "../utils/utils";
import Enterprise from '../models/enterprise';

const verifyDirector = (directors: { name: string, email: string }[]) => {
	const verify = directors.filter(director => {
		if (!director.name || !director.email) return false;
		if (!verifyEmail(director.email)) return false;
		return true;
	})
	if (verify.length === 0) return { missing: true };
	return { missing: false, directors: verify };
}

const signUp = async (body: IEnterpriseModel): Promise<resType> => {
	try {
		const verifyRequest = verifyObjectRequest(body, ['name', 'description', 'actuationField', 'director', 'founded']);
		if (verifyRequest.missing) return makeResponse(404, { message: verifyRequest.variables });
		const { name, description, actuationField, director, founded } = body;
		const enterprise = await Enterprise.findOne({ name });
		if (enterprise) return makeResponse(409, { message: 'Enteprise already exists' });
		const vDirector = verifyDirector(director);
		if (vDirector.missing) return makeResponse(400, { message: 'Incorrect director parameters' });
		const newEnteprise = new Enterprise({
			name,
			description,
			actuationField,
			director: vDirector.directors,
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

const edit = async (body: any, enterpriseID: string): Promise<resType> => {
	try {
		if (!enterpriseID) return makeResponse(400, { message: 'Missing enterpriseID' });
		const enterprise = await Enterprise.findById(enterpriseID);
		if (!enterprise) return makeResponse(404, { message: 'Enterprise not found' });
		const newEnterprise: any = { ...enterprise._doc };
		for (const requestKey of Object.keys(body)) {
			if (
				Object.keys(enterprise._doc).includes(requestKey) &&
				enterprise._doc[requestKey] !== body[requestKey]
			) newEnterprise[requestKey] = body[requestKey];
		}
		await enterprise.updateOne(newEnterprise);
		return makeResponse(200, { message: 'Enterprise updated', data: newEnterprise });
	} catch (error: any) {
		console.log(error);
		return makeResponse(500, { message: error.message });
	}
}

const list = async (query: { params?: string }): Promise<resType> => {
	try {
		const { params } = query;
		if (!params) {
			const enterprise = await Enterprise.find({});
			if (!enterprise) return makeResponse(404, { message: 'Enterprises not found' });
			return makeResponse(200, { message: 'Enterprises found', data: enterprise });
		}
		let queryParams: { [key: string]: number } = {};
		const enterpriseKeys = ['name', 'description', 'actiationField', 'director', 'founded', 'employee', 'id', "_id"];
		params.split(',').forEach((field) => {
			if (enterpriseKeys.includes(field)) {
				if (field === 'id') queryParams['_id'] = 0;
				else queryParams[field] = 1;
			}
		});
		const enterprise = await Enterprise.find({}, queryParams);
		return makeResponse(200, { message: 'Enterprises found', data: enterprise });
	} catch (error: any) {
		return makeResponse(500, { message: error.message })
	}
}


export default {
	signUp,
	edit,
	list
}