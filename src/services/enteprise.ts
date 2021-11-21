import { resType } from "../utils/types";
import { IEnterpriseModel } from '../models/enterprise';
import { makeResponse, verifyObjectRequest, verifyEmail } from "../utils/utils";
import Enterprise from '../models/enterprise';
import User from '../models/user';

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

const getEnterprise = async (id: string): Promise<resType> => {
	try {
		if (!id) return makeResponse(400, { message: 'Id not provided' });
		const enterprise = await Enterprise.findById(id);
		if (!enterprise) return makeResponse(404, { message: 'Enterprise not found' });
		return makeResponse(200, { data: enterprise });
	} catch (error: any) {
		return makeResponse(500, { message: error.message });
	}
}

const deleteEnterprise = async (entepriseId: string): Promise<resType> => {
	try {
		if (!entepriseId) return makeResponse(400, { message: 'Missing enterpriseID' });
		const enterprise = await Enterprise.findById(entepriseId);
		if (!enterprise) return makeResponse(404, { message: 'Enterprise not found' });
		await enterprise.delete();
		return makeResponse(200, { message: 'Enterprise deleted' });
	} catch (error: any) {
		return makeResponse(500, { message: error.message });
	}
}


const addEmployee = async (entepriseId: string, userId: string): Promise<resType> => {
	try {
		if (!entepriseId || !userId) return makeResponse(400, { message: 'Missing parameters' });
		const [user, enterprise] = await Promise.all([User.findById(userId), Enterprise.findById(entepriseId)]);
		if (!enterprise) return makeResponse(404, { message: 'Enterprise not found' });
		if (!user) return makeResponse(404, { message: 'User not found' });
		const alreadyAnEmployee = enterprise.employee.filter(employee => employee.userID === user.id);
		if (alreadyAnEmployee.length > 0) return makeResponse(400, { message: 'This user is already an employee' });
		if (user.role.includes("admin")) return makeResponse(400, { message: "This user canno't be vinculared to any enterprise" });
		await enterprise.updateOne(
			{
				"$push": {
					"employee": {
						userID: user.id,
						userRole: user.role
					}
				}
			})
		return makeResponse(200, { message: 'Employee added' });
	} catch (error: any) {
		return makeResponse(500, { message: error.message });
	}
}

const removeEmployee = async (entepriseId: string, userId: string): Promise<resType> => {
	try {
		if (!entepriseId || !userId) return makeResponse(400, { message: 'Missing parameters' });
		const [user, enterprise] = await Promise.all([User.findById(userId), Enterprise.findById(entepriseId)]);
		if (!enterprise) return makeResponse(404, { message: 'Enterprise not found' });
		if (!user) return makeResponse(404, { message: 'User not found' });
		const alreadyAnEmployee = enterprise.employee.filter(employee => employee.userID === user.id);
		if (alreadyAnEmployee.length === 0) return makeResponse(400, { message: "This user isn't an employee in this enterprise" });
		await enterprise.updateOne(
			{
				"$pull": {
					"employee": {
						userID: user.id,
					}
				}
			})
		return makeResponse(200, { message: 'Employee removed' });
	} catch (error: any) {
		return makeResponse(500, { message: error.message });
	}
}

const listEmployee = async (enterpriseId: string, query: { params?: string }): Promise<resType> => {
	try {
		const { params } = query;
		const enterprise = await Enterprise.findOne({ _id: enterpriseId }, { employee: 1 });
		if (!enterprise) return makeResponse(404, { message: 'Enterprise not found' });
		if (enterprise.employee.length === 0) return makeResponse(400, { message: "This enterprise doesn't have any employees" });
		let queryParams: { [key: string]: number } = {};
		const usersKeys = ['name', 'birthday', 'UF', 'city', 'password', 'schooling', 'email', "role", "_id", "id"];
		if (params) {
			params.split(',').forEach((field) => {
				if (usersKeys.includes(field)) {
					if (field === 'id') queryParams['_id'] = 0;
					else queryParams[field] = 1;
				}
			});
		}
		const employeeIds = enterprise.employee.map(employee => employee.userID);
		const users = await User.find({ _id: { $in: employeeIds } }, queryParams);
		return makeResponse(200, { message: 'Employees found', data: users });
	} catch (error: any) {
		return makeResponse(500, { message: error.message });
	}
}

export default {
	signUp,
	edit,
	list,
	getEnterprise,
	deleteEnterprise,
	addEmployee,
	removeEmployee,
	listEmployee
}