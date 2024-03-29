import expressAsyncHandler from "express-async-handler";
import userModel from '../models/UserModel.js';
import JsonWebToken from 'jsonwebtoken';
export const protectRoute = expressAsyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = JsonWebToken.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id).select('-password');
            next();
        }
        catch (error) {
            console.log(error);
            console.log('NOT AUTHORIZED');
            res.status(401);
            throw new Error('NOT AUTHORIZED');
        }
    }
    if (!token) {
        res.status(401);
        console.log('Token is missing - AUTH IS PROHIBITED');
        throw new Error('Token is missing - AUTH IS PROHIBITED');
    }
});
