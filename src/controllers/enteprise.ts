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

export default {
	signUp,
	edit
}