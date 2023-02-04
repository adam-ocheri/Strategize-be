import expressAsyncHandler from '../../node_modules/express-async-handler/index.js';
import userModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
//*For Development only:
export const getter = expressAsyncHandler(async (req, res) => {
    const allDocs = await userModel.find();
    res.json(allDocs);
});
//!---------------------------------------------------------------------------------------------------------------------------------------------------------------
//Create new (POST)
export const createNewUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //validations
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("must specify all fields to register as a new user!");
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists!');
    }
    //encrypt the user's password
    const hashSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hashSalt);
    const newUser = await userModel.create({ name: name, email: email, password: hashedPassword });
    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser._id)
        });
    }
    else {
        res.status(400);
        throw new Error('user creation failed!');
    }
});
//login to account (POST)
export const loginExistingUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(400);
            throw new Error('wrong password!');
        }
    }
    else {
        res.status(400);
        throw new Error('Invalid user email address');
    }
});
export const getCurrentUser = expressAsyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});
//!---------------------------------------------------------------------------------------------------------------------------------------------------------------
//Retrieve by ID (GET)
export const getUserById = expressAsyncHandler(async (req, res) => {
    const doc = await userModel.findById({ _id: req.params.id });
    console.log(doc);
    res.json(doc);
});
//Update by ID (PUT)
export const updateUserById = expressAsyncHandler(async (req, res) => {
    const doc = await userModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
    console.log(doc);
    res.json(doc);
});
//Delete by ID (DELETE)
export const deleteUserById = expressAsyncHandler(async (req, res) => {
    const Doc = await userModel.findByIdAndDelete({ _id: req.params.id });
    console.log(Doc);
    res.json(Doc);
});
//!------------------------------------------------------------------------------------------------------------------------------------------------------------------
const generateToken = (id) => {
    return JsonWebToken.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
