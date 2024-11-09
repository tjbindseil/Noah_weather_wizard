import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { myErrorHandler, UnusedContextController } from 'ww-3-api-tjb';
import {
    DeleteUser,
    PostAuth,
    PostConfirmation,
    PostRefresh,
    PostUser,
} from './handlers';
import { PostNewConfirmationCode } from './handlers/post_new_confirmation_code';

const app: Express = express();

// use cors accross all routes
app.use(cors());

// decode json request bodies
app.use(express.json());

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.send('HERE TJTAG');
});

const unusedContextController = new UnusedContextController();

app.post('/user', (req: Request, res: Response, next: NextFunction) => {
    new PostUser().call(req, res, next, unusedContextController);
});
app.post('/auth', (req: Request, res: Response, next: NextFunction) => {
    new PostAuth().call(req, res, next, unusedContextController);
});
app.post('/confirmation', (req: Request, res: Response, next: NextFunction) => {
    new PostConfirmation().call(req, res, next, unusedContextController);
});
app.post('/refresh', (req: Request, res: Response, next: NextFunction) => {
    new PostRefresh().call(req, res, next, unusedContextController);
});
app.delete('/user', (req: Request, res: Response, next: NextFunction) => {
    new DeleteUser().call(req, res, next, unusedContextController);
});
app.post(
    '/new-confirmation-code',
    (req: Request, res: Response, next: NextFunction) => {
        new PostNewConfirmationCode().call(
            req,
            res,
            next,
            unusedContextController
        );
    }
);

app.use(myErrorHandler);

// this is less involved than spot and forecast service because
// it does not need to asynchronously get connection info (no db usage)
export const server: http.Server = http.createServer(app);
