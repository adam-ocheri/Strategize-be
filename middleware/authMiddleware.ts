import expressAsyncHandler from "express-async-handler";
import { Request, RequestHandler, Response, NextFunction } from 'express';
import userModel from '../models/UserModel.js';
import JsonWebToken, { JwtPayload }  from 'jsonwebtoken';

export const protectRoute : RequestHandler = expressAsyncHandler(async(req: Request | any, res:Response, next:NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded : any | string | JwtPayload = JsonWebToken.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            console.log('NOT AUTHORIZED');
            res.status(401);
            throw new Error('NOT AUTHORIZED')
        }
    }

    if (!token) 
    {
        res.status(401);
        console.log('Token is missing - AUTH IS PROHIBITED');
        throw new Error('Token is missing - AUTH IS PROHIBITED');
    }
})