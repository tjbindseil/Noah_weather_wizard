import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { myErrorHandler, PGContextController } from 'ww-3-api-tjb';
import {
    GetForecasts,
    GetForecastsHourly,
    GetPossibleForecasts,
    GetRankedForecasts,
    GetPossibleForecastsHourly,
    GetRankedForecastsHourly,
} from './handlers/index';
import { get_app_config } from 'ww-3-app-config-tjb';
import { Client } from 'ts-postgres';
import { createPool } from 'generic-pool';
import {
    ForecastHourlyProcessor,
    ForecastProcessor,
} from './processors/processor';

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
            const client = new Client(
                get_app_config().locationDbConnectionConfig
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

const forecastHourlyProcessor = new ForecastHourlyProcessor();
const forecastProcessor = new ForecastProcessor();

app.get('/forecasts', (req: Request, res: Response, next: NextFunction) => {
    new GetForecasts().call(req, res, next, pgContextController);
});
app.get(
    '/possible_forecasts',
    (req: Request, res: Response, next: NextFunction) => {
        new GetPossibleForecasts(forecastProcessor).call(
            req,
            res,
            next,
            pgContextController
        );
    }
);
app.get(
    '/ranked_forecasts',
    (req: Request, res: Response, next: NextFunction) => {
        new GetRankedForecasts(forecastProcessor).call(
            req,
            res,
            next,
            pgContextController
        );
    }
);
app.get(
    '/forecasts_hourly',
    (req: Request, res: Response, next: NextFunction) => {
        new GetForecastsHourly().call(req, res, next, pgContextController);
    }
);
app.get(
    '/possible_forecasts_hourly',
    (req: Request, res: Response, next: NextFunction) => {
        new GetPossibleForecastsHourly(forecastHourlyProcessor).call(
            req,
            res,
            next,
            pgContextController
        );
    }
);
app.get(
    '/ranked_forecasts_hourly',
    (req: Request, res: Response, next: NextFunction) => {
        new GetRankedForecastsHourly(forecastHourlyProcessor).call(
            req,
            res,
            next,
            pgContextController
        );
    }
);

app.use(myErrorHandler);

export const server: http.Server = http.createServer(app);
