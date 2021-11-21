import { Request, Response } from 'express';
import enteprise from '../services/enteprise';

const signUp = async (req: Request, res: Response) => {
	const { body } = req;
	const controller = await enteprise.signUp(body);
	return res.status(controller.status).json(controller.response);
}

const edit = async (req: Request, res: Response) => {
	const { body, params } = req;
	const controller = await enteprise.edit(body, params.id);
	return res.status(controller.status).json(controller.response);
}

const list = async (req: Request, res: Response) => {
	const { query } = req;
	const controller = await enteprise.list(query);
	return res.status(controller.status).json(controller.response);
}

const getEnterprise = async (req: Request, res: Response) => {
	const { id } = req.params;
	const controller = await enteprise.getEnterprise(id);
	return res.status(controller.status).json(controller.response);
}

const deleteEnterprise = async (req: Request, res: Response) => {
	const { id } = req.params;
	const controller = await enteprise.deleteEnterprise(id);
	return res.status(controller.status).json(controller.response);
}

const addEmployee = async (req: Request, res: Response) => {
	const { enterpriseId, userId } = req.params;
	const controller = await enteprise.addEmployee(enterpriseId, userId);
	return res.status(controller.status).json(controller.response);
}

const removeEmployee = async (req: Request, res: Response) => {
	const { enterpriseId, userId } = req.params;
	const controller = await enteprise.removeEmployee(enterpriseId, userId);
	return res.status(controller.status).json(controller.response);
}

const listEmployee = async (req: Request, res: Response) => {
	const { query } = req;
	const { enterpriseId } = req.params;
	const controller = await enteprise.listEmployee(enterpriseId, query);
	return res.status(controller.status).json(controller.response);
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