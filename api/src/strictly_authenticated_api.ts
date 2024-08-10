import { NextFunction, Request, Response } from 'express';
import { API } from './api';
import {
    JWTAuthenticator,
    makeCognitoJWTAuthenticator,
    defaultVerifier,
} from './auth';
import { ContextController } from './context_controllers';

export abstract class StrictlyAuthenticatedAPI<I, O, C> extends API<I, O, C> {
    protected validatedUsername!: string;
    private readonly jwtAuthenticator: JWTAuthenticator;

    constructor() {
        super();
        this.jwtAuthenticator = makeCognitoJWTAuthenticator(defaultVerifier);
    }

    public async call(
        req: Request<unknown, O, I>,
        res: Response,
        next: NextFunction,
        contextController: ContextController<C>
    ) {
        this.validatedUsername = await this.jwtAuthenticator(
            req.headers.authorization
        );
        super.call(req, res, next, contextController);
    }
}
