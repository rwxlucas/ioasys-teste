import { Router } from "express";
import user from './user';
import enteprise from './enterprise';

const route = Router();

route.use('/user', user); // Users route
route.use('/enterprise', enteprise); // Enteprise route

export default route;