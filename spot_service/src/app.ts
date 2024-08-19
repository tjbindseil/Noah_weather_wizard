import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { myErrorHandler, PGContextController } from 'ww-3-api-tjb';
import { DeleteSpot, GetSpots, PostSpot } from './handlers';
import { get_app_config } from 'ww-3-app-config-tjb';
import { Client } from 'ts-postgres';
import { createPool } from 'generic-pool';

const app: Express = express();

// use cors accross all routes
app.use(cors());

// decode json request bodies
app.use(express.json());

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.send('HERE TJTAG');
});

const pool = createPool(
    {
        create: async () => {
            const client = new Client(get_app_config().spotDbConnectionConfig);
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

app.get('/spots', (req: Request, res: Response, next: NextFunction) => {
    new GetSpots().call(req, res, next, pgContextController);
});
app.post('/spot', (req: Request, res: Response, next: NextFunction) => {
    new PostSpot().call(req, res, next, pgContextController);
});
app.delete('/spot', (req: Request, res: Response, next: NextFunction) => {
    new DeleteSpot().call(req, res, next, pool);
});

app.use(myErrorHandler);

export const server: http.Server = http.createServer(app);
