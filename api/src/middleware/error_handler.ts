import { NextFunction, Request, Response } from 'express';
import { APIError } from '../api_error';

export const myErrorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.log('@@ @@ TJTAG HERE IN MIDDLEWARE');
    res.set('Content-Type', 'application/json');
    if (err instanceof APIError) {
        const apiError = err as APIError;
        res.status(apiError.statusCode);
        res.send({ message: apiError.message });
    } else {
        res.status(500);
        res.send({ message: 'unknown error' });
    }
};
