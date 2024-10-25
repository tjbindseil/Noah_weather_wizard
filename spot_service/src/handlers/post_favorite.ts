import {
    PostFavoriteInput,
    PostFavoriteOutput,
    _schema,
} from 'ww-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import {
    S3Adapter,
    getForecast,
    makeInitialCall,
    insertFavorite,
} from 'ww-3-utilities-tjb';

export class PostFavorite extends StrictlyAuthenticatedAPI<
    PostFavoriteInput,
    PostFavoriteOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostFavoriteInput);
    }

    constructor(private readonly s3Adapter: S3Adapter) {
        super();
    }

    private trimLatLong(n: number) {
        return Number.parseFloat(n.toFixed(4));
    }

    public async process(
        input: PostFavoriteInput,
        pgClient: Client
    ): Promise<PostFavoriteOutput> {
        const trimmedLat = this.trimLatLong(input.latitude);
        const trimmedLong = this.trimLatLong(input.longitude);
        const forecastKey = await makeInitialCall(trimmedLat, trimmedLong);

        try {
            const existingGeometry = await this.s3Adapter.getGeometryJson(
                forecastKey
            );

            // for now, we are checking existing geometry to make sure it doesn't change
            // this will ultimately be removed once it is clear that they don't change (fingers crossed)
            const [_forecastJson, geometryJson] = await getForecast(
                forecastKey
            );

            if (JSON.stringify(geometryJson) !== existingGeometry) {
                console.error(
                    `HEADS UP! geometry for this polygon has changed. existing: ${existingGeometry} and fetched: ${JSON.stringify(
                        geometryJson
                    )}`
                );
                throw new APIError(500, 'assumptions failed');
            }
            /* eslint-disable  @typescript-eslint/no-explicit-any */
        } catch (error: any) {
            if (error.name === 'NoSuchKey') {
                // TODO hmm, this is done twice, maybe move?
                const [forecastJson, geometryJson] = await getForecast(
                    forecastKey
                );

                await this.s3Adapter.putForecastJson(forecastKey, forecastJson);
                await this.s3Adapter.putGeometryJson(forecastKey, geometryJson);
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
