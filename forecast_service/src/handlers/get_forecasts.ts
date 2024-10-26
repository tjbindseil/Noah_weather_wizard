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
import { ForecastKey, getSpot, S3Adapter } from 'ww-3-utilities-tjb';

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

    // TODO I think failures here stop the service
    public async process(
        input: GetForecastsInput,
        pgClient: Client
    ): Promise<GetForecastsOutput> {
        const spotIds: number[] = input.spotIDs
            .split(',')
            .map((str) => parseFloat(str));

        const spotPromises: Promise<Spot>[] = [];
        for (let i = 0; i < spotIds.length; ++i) {
            spotPromises.push(getSpot(pgClient, spotIds[i]));
        }
        const forecastKeys = (await Promise.all(spotPromises)).map(
            (spot) => new ForecastKey(spot.polygonID, spot.gridX, spot.gridY)
        );

        const forecastJsonPromises: Promise<Forecast>[] = [];
        for (let i = 0; i < forecastKeys.length; ++i) {
            forecastJsonPromises.push(
                this.s3Adapter.getForecastJson(forecastKeys[i])
            );
        }
        const forecasts = await Promise.all(forecastJsonPromises);

        return {
            forecasts,
        };
    }
}
