import { Router } from "express";
import user from '../controllers/user';
import { userPermission } from "../middlewares/verifyJwt";

const route = Router();

route.get('/:id', user.getUserData); // @GET GET user data
route.post('/signup', user.signUp); // @POST Register user
route.post('/signin', user.signIn); // @POST Log in user
route.put('/edituser/:id', userPermission, user.editUser); // @PUT Edit user info
route.post('/listusers', user.listUsers); // @POST Return list of users
route.delete('/:id', user.deleteUser); // @DELETE Delete specific user

export default route;