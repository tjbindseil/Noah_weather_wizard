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
import { ForecastKey, S3Adapter } from 'ww-3-utilities-tjb';
import { getSpotToForecastKeyMap } from './utils';

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
        const spotToForecastKeyMap = await getSpotToForecastKeyMap(
            pgClient,
            input.spotIDs
        );

        const spotToForecastMap = new Map<Spot, Forecast>();

        const getForecastPromises: Promise<void>[] = [];

        const setForecast = async (spot: Spot, forecastKey: ForecastKey) => {
            const forecast = await this.s3Adapter.getForecast(forecastKey);
            spotToForecastMap.set(spot, forecast);
        };

        spotToForecastKeyMap.forEach((forecastKey, spot) => {
            getForecastPromises.push(setForecast(spot, forecastKey));
        });

        for (let i = 0; i < getForecastPromises.length; ++i) {
            await getForecastPromises[i];
        }

        const ret: GetForecastsOutput = {
            forecasts: [],
        };
        spotToForecastMap.forEach((forecast, spot) =>
            ret.forecasts.push({
                spot,
                forecast,
            })
        );

        return ret;
    }
}
