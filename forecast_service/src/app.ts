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
    PostForecastRefresh,
} from './handlers/index';
import { get_app_config } from 'ww-3-app-config-tjb';
import {
    ForecastHourlyProcessor,
    ForecastProcessor,
} from './processors/processor';
import { make_fetch_forcast } from './forecast_fetcher';
import { S3Client } from '@aws-sdk/client-s3';
import { getPgClientPool, S3Adapter } from 'ww-3-utilities-tjb';

const app: Express = express();

// use cors accross all routes
app.use(cors());

// decode json request bodies
app.use(express.json());

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.send('HERE TJTAG');
});

// Hmmm, this is pretty independent of the forecast_service
// this could easily be a lambda that triggers another lambda
// initial lambda just reads all the polygons, and for each polygon,
// it queues up a bunch of SQS messages, each has a forecastURL and polygonID
// then, a lambda (paralellized) consumes those messages and fetches the
// latest forecast for each
//
// until this gets moved to AWS and starts getting scaled, its not necessary
// TODO delete is actually a bit more complicated,
// if there is no more spots looking at it, we should delete the s3 folder and its contents
// -- OR --
// we could do that in the background as part of the updating of the cache
//
// ...
//
// while im at it, it could be helpful to delete duplicate rows in the spot table?
const bucketName = get_app_config().forecastBucketName;
const s3Client = new S3Client({
    region: 'us-east-1',
});
const s3Adapter = new S3Adapter(s3Client, bucketName);

const fourHoursInMilliseconds = 1000 * 60 * 60 * 4;
const fetchForecastFunc = make_fetch_forcast(s3Adapter);
setInterval(fetchForecastFunc, fourHoursInMilliseconds);

export const createServer = async (): Promise<http.Server> => {
    const pool = await getPgClientPool();
    const pgContextController = new PGContextController(pool);

    const forecastHourlyProcessor = new ForecastHourlyProcessor();
    const forecastProcessor = new ForecastProcessor();

    app.get('/forecasts', (req: Request, res: Response, next: NextFunction) => {
        new GetForecasts(s3Adapter).call(req, res, next, pgContextController);
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

    // backdoor way to clean up forecasts that get uploaded incorrectly
    app.post(
        '/forecast_refresh',
        (req: Request, res: Response, next: NextFunction) => {
            new PostForecastRefresh(s3Adapter).call(
                req,
                res,
                next,
                pgContextController
            );
        }
    );

    app.use(myErrorHandler);

    return http.createServer(app);
};
