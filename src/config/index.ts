import { config } from 'dotenv';
config();

interface IKeys {
	serverPort: string;
	databaseUrl: string;
	authJWT: string;
	adminKey: string;
	superUser: string;
}
const keys: IKeys = {
	serverPort: process.env.SERVER_PORT!,
	databaseUrl: process.env.DATABASE_URL!,
	authJWT: process.env.AUTH_JWT!,
	adminKey: process.env.ADMIN_KEY!,
	superUser: process.env.SUPER_USER!
}

export default keys;