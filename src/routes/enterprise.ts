import { Router } from "express";
import enteprise from '../controllers/enteprise';
import { onlyAdmin } from "../middlewares/auth";

const route = Router();

route.post('/signup', onlyAdmin, enteprise.signUp); // @POST Register enteprise
route.put('/edit/:id', onlyAdmin, enteprise.edit); // @PUT Edit enteprise

export default route;