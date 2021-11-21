import { Router } from "express";
import user from '../controllers/user';
import { editUser, getUserData, onlyAdmin } from "../middlewares/auth";

const route = Router();

route.get('/list', onlyAdmin, user.listUsers); // @GET Return list of users
route.get('/:id', getUserData, user.getUserData); // @GET GET user data
route.post('/signup', user.signUp); // @POST Register user
route.post('/signin', user.signIn); // @POST Log in user
route.put('/edit/:id', editUser, user.editUser); // @PUT Edit user info
route.delete('/:id', onlyAdmin, user.deleteUser); // @DELETE Delete specific user

export default route;