import { PostSpotInput, PostSpotOutput, _schema } from 'ww-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import {
    S3Adapter,
    getForecast,
    getForecastHourly,
    getForecastKey,
    insertSpot,
} from 'ww-3-utilities-tjb';

export class PostSpot extends StrictlyAuthenticatedAPI<
    PostSpotInput,
    PostSpotOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostSpotInput);
    }

    constructor(private readonly s3Adapter: S3Adapter) {
        super();
    }

    private trimLatLong(n: number) {
        return Number.parseFloat(n.toFixed(4));
    }

    public async process(
        input: PostSpotInput,
        pgClient: Client
    ): Promise<PostSpotOutput> {
        if (input.name === '') {
            throw new APIError(400, 'invalid input');
        }

        const trimmedLat = this.trimLatLong(input.latitude);
        const trimmedLong = this.trimLatLong(input.longitude);
        const forecastKey = await getForecastKey(trimmedLat, trimmedLong);

        try {
            await this.s3Adapter.getForecast(forecastKey);

            /* eslint-disable  @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            if (error.name === 'NoSuchKey') {
                const forecast = await getForecast(forecastKey);
                const forecastHourly = await getForecastHourly(forecastKey);

                await this.s3Adapter.putForecast(forecastKey, forecast);
                await this.s3Adapter.putForecastHourly(
                    forecastKey,
                    forecastHourly
                );
            } else {
                throw error;
            }
        }

        const insertedSpot = await insertSpot(pgClient, {
            name: input.name,
            latitude: trimmedLat,
            longitude: trimmedLong,
            polygonID: forecastKey.polygonID,
            gridX: forecastKey.gridX,
            gridY: forecastKey.gridY,
            creator: this.validatedUsername,
        });

        return { spot: insertedSpot };
    }
}
