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

export const hasPermissionToEdit = (requesterRole: string[], targetRole: string[]) => {
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

const decodeJwt = (token: string) => {
	try {
		const decoded = [env.adminKey, env.superUser, env.authJWT].map(jwtKey => {
			try {
				const verify = (<IJwtPayload>jwt.verify(token, jwtKey));
				return verify.userID
			} catch (error) {
				return false;
			}
		}).filter(item => item);
		if (decoded.length === 0) throw false;
		return {
			userID: decoded[0]
		};
	} catch (error) {
		throw { message: 'Not Allowed' };
	}
}

export const userPermission = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token: string = (<IHeaders>req.headers).token;
		if (!token) return res.status(400).json({ message: 'Token not provided' });
		const decoded = decodeJwt(token);
		const user = await User.findById(decoded.userID);
		const targetUser = await User.findById(req.params.id);
		if (!user || !targetUser) throw { message: 'Missing parameters' }
		if (hasPermissionToEdit(user.role!, targetUser.role!)) next();
	} catch (err: any) {
		if (err.message == 'invalid signature' || err.message == 'NotAllowed') {
			return res.status(403).json({ message: 'Not allowed' });
		}
		return res.status(500).json({ message: err.message });
	}
}