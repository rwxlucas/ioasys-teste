import { Request, Response } from 'express';
import user from '../services/user';

const signUp = async (req: Request, res: Response) => {
	const { body } = req;
	const controller = await user.signUp(body);
	return res.status(controller.status).json(controller.response);
}

const signIn = async (req: Request, res: Response) => {
	const { body } = req;
	const controller = await user.signIn(body);
	return res.status(controller.status).json(controller.response);
}

const editUser = async (req: Request, res: Response) => {
	const { body, params } = req;
	const controller = await user.editUser(body, params.id);
	return res.status(controller.status).json(controller.response);
}

const getUserData = async (req: Request, res: Response) => {
	const { id } = req.params;
	const controller = await user.getUserData(id);
	return res.status(controller.status).json(controller.response);
}

const listUsers = async (req: Request, res: Response) => {
	const { body } = req;
	const controller = await user.listUsers(body);
	return res.status(controller.status).json(controller.response);
}

const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const controller = await user.deleteUser(id);
	return res.status(controller.status).json(controller.response);
}

export default {
	signUp,
	signIn,
	editUser,
	getUserData,
	listUsers,
	deleteUser
}