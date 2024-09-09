import {
    Forecast,
    GetForecastsInput,
    GetForecastsOutput,
    Spot,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { getSpot, S3Adapter } from 'ww-3-utilities-tjb';
import { getForecasts } from '../db/dbo';

export class GetForecasts extends LooselyAuthenticatedAPI<
    GetForecastsInput,
    GetForecastsOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetForecastsInput);
    }

    constructor(private readonly s3Adapter: S3Adapter) {
        super();
    }

    public async process(
        input: GetForecastsInput,
        pgClient: Client
    ): Promise<GetForecastsOutput> {
        // foreach point ID
        // get the point
        // get the polygon
        // get the forecast
        const spotPromises: Promise<Spot>[] = [];
        for (let i = 0; i < input.pointIDs.length; ++i) {
            spotPromises.push(getSpot(pgClient, input.pointIDs[i]));
        }
        const polygons = (await Promise.all(spotPromises)).map(
            (spot) => spot.polygonID
        );

        const forecastJsonPromises: Promise<string>[] = [];
        for (let i = 0; i < polygons.length; ++i) {
            forecastJsonPromises.push(
                this.s3Adapter.getForecastJson(polygons[i])
            );
        }
        const forecasts = (await Promise.all(forecastJsonPromises)).map(
            (forecastJson) => ({ ...JSON.parse(forecastJson) })
        );

        return {
            // TODO ajv
            forecasts: forecasts,
        };
    }
}
