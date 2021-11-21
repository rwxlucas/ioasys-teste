import { Router } from "express";
import enteprise from '../controllers/enteprise';
import { onlyAdmin, onlyStaff } from "../middlewares/auth";

const route = Router();

route.post('/signup', onlyAdmin, enteprise.signUp); // @POST Register enteprise
route.put('/addemployee/:enterpriseId/:userId', onlyStaff, enteprise.addEmployee); // @PUT Add employee to enterprise
route.put('/removeemployee/:enterpriseId/:userId', onlyStaff, enteprise.removeEmployee); // @PUT Remove employee to enterprise
route.put('/edit/:id', onlyAdmin, enteprise.edit); // @PUT Edit enteprise
route.get('/list', onlyAdmin, enteprise.list); // @GET Get enteprise list
route.get('/listemployee/:enterpriseId', onlyAdmin, enteprise.listEmployee); // @GET Get employee list
route.get('/:id', onlyAdmin, enteprise.getEnterprise); // @GET Get enteprise
route.delete('/:id', onlyAdmin, enteprise.deleteEnterprise); // @DELETE Delete enteprise

export default route;