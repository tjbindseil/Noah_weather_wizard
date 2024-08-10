import { S3Client } from '@aws-sdk/client-s3';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { myErrorHandler, PGContextController } from 'ww-3-api-tjb';
import {
    DeleteInvite,
    DeletePicture,
    GetInvites,
    GetPictures,
    PostInvite,
    PostPicture,
} from './handlers/index';
import { get_app_config } from 'dwf-3-app-config-tjb';
import { Client } from 'ts-postgres';
import { createPool } from 'generic-pool';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const app: Express = express();

// use cors accross all routes
app.use(cors());

// decode json request bodies
app.use(express.json());

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.send('HERE TJTAG');
});

const bucketName = get_app_config().bucketName;
const s3Client = new S3Client({
    region: 'us-east-1',
});

const pool = createPool(
    {
        create: async () => {
            const client = new Client(
                get_app_config().pictureDbConnectionConfig
            );
            await client.connect();
            client.on('error', console.log);
            return client;
        },
        destroy: async (client: Client) => client.end(),
        validate: (client: Client) => {
            return Promise.resolve(!client.closed);
        },
    },
    {
        testOnBorrow: true,
        max: 10,
        min: 2,
    }
);
const pgContextController = new PGContextController(pool);

app.get('/pictures', (req: Request, res: Response, next: NextFunction) => {
    // pretty simple stuff here:
    // https://medium.com/@akhilanand.ak01/implementing-server-side-pagination-in-react-with-node-js-and-express-417d1c480630
    //
    // questions:
    // * what if page size is changed? - this happens on the frontend and we can just reset to first page
    new GetPictures(bucketName).call(req, res, next, pgContextController);
});
app.post('/picture', (req: Request, res: Response, next: NextFunction) => {
    new PostPicture(bucketName, s3Client).call(
        req,
        res,
        next,
        pgContextController
    );
});
app.delete('/picture', (req: Request, res: Response, next: NextFunction) => {
    new DeletePicture(s3Client).call(req, res, next, pool);
});

const client = new CognitoIdentityProviderClient({});
app.get('/invites', (req: Request, res: Response, next: NextFunction) => {
    new GetInvites().call(req, res, next, pool);
});
app.post('/invite', (req: Request, res: Response, next: NextFunction) => {
    new PostInvite(client).call(req, res, next, pool);
});
app.delete('/invite', (req: Request, res: Response, next: NextFunction) => {
    new DeleteInvite().call(req, res, next, pool);
});

app.use(myErrorHandler);

export const server: http.Server = http.createServer(app);
