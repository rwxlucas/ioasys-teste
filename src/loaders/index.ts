import { Application } from "express";
import express from "./express";
import mongodb from './mongodb';

interface ILoaders {
	expressApp: Application
}
export default ({ expressApp }: ILoaders): Promise<any> => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log('Initializing loaders...');
			await Promise.all([
				express({ app: expressApp }),
				mongodb()
			])
			console.log('***Express loaded');
			console.log('***MongoDB loaded');
			return resolve(true);
		} catch (err) {
			if (err) {
				console.log(err);
				return reject(err)
			};
		}
	})
}