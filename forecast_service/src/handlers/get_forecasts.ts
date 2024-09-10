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
        console.log('!@@ @@ preocess');
        const spotPromises: Promise<Spot>[] = [];
        for (let i = 0; i < input.pointIDs.length; ++i) {
            spotPromises.push(getSpot(pgClient, input.pointIDs[i]));
        }
        const polygons = (await Promise.all(spotPromises)).map(
            (spot) => spot.polygonID
        );
        console.log(`!@@ @@ polygons are: ${polygons}`);

        const forecastJsonPromises: Promise<Forecast>[] = [];
        for (let i = 0; i < polygons.length; ++i) {
            forecastJsonPromises.push(
                this.s3Adapter.getForecastJson(polygons[i])
            );
        }
        const forecasts = await Promise.all(forecastJsonPromises);

        return {
            forecasts,
        };
    }
}
