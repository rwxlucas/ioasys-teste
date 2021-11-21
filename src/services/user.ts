import { resType } from "../utils/types";
import { IUserModel } from "../models/user";
import { makeResponse, valuesToLowerCase, verifyObjectRequest } from "../utils/utils";
import jwt from 'jsonwebtoken';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { roles } from "../middlewares/auth";

const signUp = async (body: IUserModel): Promise<resType> => {
  try {
    const verifyRequest = verifyObjectRequest(body, ['name', 'birthday', 'UF', 'password', 'city', 'email', 'schooling']);
    if (verifyRequest.missing) return makeResponse(404, { message: verifyRequest.variables });
    const { name, email, birthday, UF, password, city, schooling } = valuesToLowerCase(body, ['password']);
    const user = await User.findOne({ email });
    if (user) return makeResponse(409, { message: 'User already exists' });
    const newUser = new User({
      name,
      password: bcrypt.hashSync(password, 12),
      email,
      birthday,
      UF,
      city,
      schooling,
      role: ['user'] // Adicionar manipulação do role do user
    });
    await newUser.save();
    return makeResponse(200, { message: 'User created', data: newUser.id });
  } catch (error: any) {
    console.log(error);
    return makeResponse(500, { message: error.message });
  }
}

const signIn = async (body: { email: string, password: string }): Promise<resType> => {
  try {
    const { email, password } = body;
    if (!email || !password) return makeResponse(400, { message: 'Missing login parameters' });
    const user = await User.findOne({ email });
    if (!user) return makeResponse(404, { message: 'Incorrect email' });
    const verifyPw = await bcrypt.compare(password, user.password);
    if (!verifyPw) return makeResponse(401, { message: 'Incorrect password' });
    return makeResponse(200, { message: 'Sucess', data: jwt.sign({ userID: user.id }, roles(user.role)) });
  } catch (error: any) {
    return makeResponse(500, { message: error.message });
  }
}

const editUser = async (body: any, userID: string): Promise<resType> => {
  try {
    if (!userID) return makeResponse(400, { message: 'Missing userID' });
    const user = await User.findById(userID);
    if (!user) return makeResponse(404, { message: 'User not found' });
    const newUser: any = { ...user._doc };
    for (const requestKey of Object.keys(body)) {
      if (Object.keys(user._doc).includes(requestKey) && user._doc[requestKey] !== body[requestKey]) {
        if (requestKey === 'email') {
          const emailAlreadyExists = await User.findOne({ email: body[requestKey] });
          if (emailAlreadyExists) return makeResponse(409, { message: 'Email already exists' });
        }
        if (requestKey === 'password') {
          newUser[requestKey] = bcrypt.hashSync(body[requestKey], 12);
          continue;
        }
        // Adicionar verificação para edição de role
        newUser[requestKey] = body[requestKey];
      }
    }
    await user.updateOne(newUser);
    return makeResponse(200, { message: 'User updated', data: newUser });
  } catch (error: any) {
    console.log(error);
    return makeResponse(500, { message: error.message });
  }
}

const getUserData = async (userID: string): Promise<resType> => {
  try {
    if (!userID) return makeResponse(400, { message: 'Missing userID' });
    const user = await User.findById(userID);
    if (!user) return makeResponse(404, { message: 'User not found' });
    return makeResponse(200, { data: user._doc });
  } catch (error: any) {
    return makeResponse(500, { message: error.message });
  }
}

const listUsers = async (query: { params?: string }): Promise<resType> => {
  try {
    const { params } = query;
    if (!params) {
      const users = await User.find({});
      if (!users) return makeResponse(404, { message: 'Users not found' });
      return makeResponse(200, { data: users });
    }
    let queryParams: { [key: string]: number } = {};
    const usersKeys = ['name', 'birthday', 'UF', 'city', 'password', 'schooling', 'email', "role", "_id", "id"];
    params.split(',').forEach((field) => {
      if (usersKeys.includes(field)) {
        if (field === 'id') queryParams['_id'] = 0;
        else queryParams[field] = 1;
      }
    });
    const users = await User.find({}, queryParams);
    return makeResponse(200, { data: users });
  } catch (error: any) {
    return makeResponse(500, { message: error.message })
  }
}

const deleteUser = async (userID: string): Promise<resType> => {
  try {
    if (!userID) return makeResponse(400, { message: 'Missing userID' });
    const user = await User.findById(userID);
    if (!user) return makeResponse(404, { message: 'User not found' });
    await user.delete();
    return makeResponse(200, { message: 'User deleted' });
  } catch (error: any) {
    return makeResponse(500, { message: error.message });
  }
}

export default {
  signUp,
  signIn,
  editUser,
  getUserData,
  listUsers,
  deleteUser
}