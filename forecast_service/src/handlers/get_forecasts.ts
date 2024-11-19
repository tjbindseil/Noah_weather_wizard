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

    public async process(
        input: GetForecastsInput,
        pgClient: Client
    ): Promise<GetForecastsOutput> {
        const spotIds: number[] = input.spotIDs
            .split(',')
            .map((str) => parseFloat(str));

        const promises: Promise<{
            spot: Spot;
            forecast: Forecast;
        }>[] = [];
        for (let i = 0; i < spotIds.length; ++i) {
            promises.push(
                getSpot(pgClient, spotIds[i]).then(async (spot) => {
                    const fk = new ForecastKey(
                        spot.polygonID,
                        spot.gridX,
                        spot.gridY
                    );

                    const forecast = await this.s3Adapter.getForecast(fk);

                    return {
                        spot,
                        forecast,
                    };
                })
            );
        }

        return {
            forecasts: await Promise.all(promises),
        };
    }
}
