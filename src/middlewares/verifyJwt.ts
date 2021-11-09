import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../config/index';
import User from '../models/user';

interface IJwtPayload extends JwtPayload {
	userID?: string;
}

export interface IHeaders extends IncomingHttpHeaders {
	token: string;
}

export const roles = (role: string[]): string => {
	if (role.includes('admin')) return env.adminKey;
	else if (role.includes('super_user')) return env.authJWT;
	return env.authJWT;
}

const hasPermissionToEdit = (requesterRole: string[], targetRole: string[]) => {
	if (requesterRole.includes('admin')) return true;
	if (requesterRole.includes('super_user') && targetRole.includes('admin')) throw false;
	if (
		requesterRole.includes('user') &&
		requesterRole.length == 1 &&
		!targetRole.includes('admin') &&
		!targetRole.includes('super_user')
	) return true;
	throw false;
}

export const userPermission = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token: string = (<IHeaders>req.headers).token;
		if (!token) return res.status(400).json({ message: 'Token not provided' });
		const decoded = (<IJwtPayload>jwt.verify(token, env.adminKey));
		const user = await User.findById(decoded.userID);
		const targetUser = await User.findById(req.params.id);
		if (!user || !targetUser) throw { message: 'Missing parameters' }
		if (hasPermissionToEdit(user.role!, targetUser.role!)) next();
	} catch (err: any) {
		console.log(err);
		if (err.message == 'invalid signature') return res.status(403).json({ message: 'Not allowed' });
		return res.status(500).json({ message: err.message });
	}
}