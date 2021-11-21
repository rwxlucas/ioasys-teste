import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../config/index';
import User from '../models/user';
import { IUserModel } from "../utils/types";

interface IJwtPayload extends JwtPayload {
	userID?: string;
}

export interface IHeaders extends IncomingHttpHeaders {
	token: string;
}

const hasPermissionToEdit = (requesterRole: string[], targetRole: string[]) => {
	if (requesterRole.includes('admin')) return true;
	if (requesterRole.includes('super_user') && targetRole.includes('admin')) throw { message: 'NotAllowed' };
	if (
		requesterRole.includes('user') &&
		requesterRole.length === 1 &&
		!targetRole.includes('admin') &&
		!targetRole.includes('super_user')
	) return true;
	throw { message: 'NotAllowed' };
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

const getDecoded = (id: string) => {
	if (!id) throw { message: 'NotAllowed' };
	return decodeJwt(id);
}

const getUsers = async (usersIds: string[]) => {
	try {
		return (await Promise.all(usersIds.map(id => User.findById(id)))).map(({ _doc }: any) => _doc);
	} catch (error) {
		throw { message: "Users not found" };
	}
}

export const roles = (role: string[]): string => {
	if (role.includes('admin')) return env.adminKey;
	else if (role.includes('super_user')) return env.authJWT;
	return env.authJWT;
}

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!(<IHeaders>req.headers).token || !req.params.id) throw { message: 'NotAllowed' };
		const decoded = getDecoded((<IHeaders>req.headers).token);
		const [user, targetUser] = await getUsers([decoded.userID as string, req.params.id]);
		if (!user || !targetUser) throw { message: 'Users not found' };
		if (hasPermissionToEdit(user.role!, targetUser.role!)) return next();
	} catch (error: any) {
		if (error.message === 'invalid signature' || error.message === 'NotAllowed') {
			return res.status(403).json({ message: 'Not allowed' });
		}
		return res.status(500).json({ message: error.message });
	}
}

const hasPermissionToGet = (user: IUserModel, target: IUserModel) => {
	if (user.role.includes('admin')) return true;
	if (user.id === target.id) return true;
	throw { message: 'NotAllowed' };
}

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!(<IHeaders>req.headers).token || !req.params.id) throw { message: 'NotAllowed' };
		const decoded = getDecoded((<IHeaders>req.headers).token);
		const [user, targetUser] = await getUsers([decoded.userID as string, req.params.id]);
		if (!user || !targetUser) throw { message: 'Users not found' };
		if (hasPermissionToGet(user, targetUser)) return next();
		throw { message: 'NotAllowed' };
	} catch (error: any) {
		if (error.message === 'invalid signature' || error.message === 'NotAllowed') {
			return res.status(403).json({ message: 'Not allowed' });
		}
		return res.status(500).json({ message: error.message });
	}
}

export const onlyAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!(<IHeaders>req.headers).token) throw { message: 'NotAllowed' };
		const decoded = getDecoded((<IHeaders>req.headers).token);
		const [user] = await getUsers([decoded.userID as string]);
		if (!user) throw { message: 'User not found' };
		if (user.role.includes('admin')) return next();
		throw { message: 'NotAllowed' };
	} catch (error: any) {
		if (error.message === 'invalid signature' || error.message === 'NotAllowed') {
			return res.status(403).json({ message: 'Not allowed' });
		}
		return res.status(500).json({ message: error.message });
	}
}