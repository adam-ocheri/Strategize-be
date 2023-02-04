import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler = (err, req: Request, res: Response, next : NextFunction) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
}