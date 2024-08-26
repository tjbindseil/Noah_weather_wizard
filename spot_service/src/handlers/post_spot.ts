import { PostSpotInput, PostSpotOutput, _schema } from 'ww-3-models-tjb';
import { APIError, LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { insertSpot } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { S3Adapter, getForecast, makeInitialCall } from 'ww-3-utilities-tjb';

export class PostSpot extends LooselyAuthenticatedAPI<
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
        const trimmedLat = this.trimLatLong(input.latitude);
        const trimmedLong = this.trimLatLong(input.longitude);
        const [polygonID, forecastUrl] = await makeInitialCall(
            trimmedLat,
            trimmedLong
        );

        try {
            const existingGeometry = await this.s3Adapter.getGeometryJson(
                polygonID
            );

            // for now, we are checking existing geometry to make sure it doesn't change
            // this will ultimately be removed once it is clear that they don't change (fingers crossed)
            const [_forecastJson, geometryJson] = await getForecast(
                forecastUrl
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
                    forecastUrl
                    // well, what is it?
                    // is it a hashmap?
                    // polygonID -> forecastURL
                    //
                    // actually, it would be:
                    // forecastURL -> polygonID
                    //
                    // because we would fetch the forecastURL, and then decide where to put it (ie we would then need the polygonID
                    //
                    // option 1)
                    // well, each spot already has the polygonID,
                    // we can store the forecastURL there as well, and then select distinct
                    //
                    // option 2)
                    // table with polygonID and forecastURL
                    //
                    // for option 1, selecting distinct is rough, so probably best to do option 2
                    //
                    // I think this will necessitate moving the dbo to the utilities dir
                );

                await this.s3Adapter.putForecastJson(polygonID, forecastJson);
                await this.s3Adapter.putGeometryJson(polygonID, geometryJson);
            } else {
                throw error;
            }
        }

        const insertedSpot = await insertSpot(pgClient, {
            name: input.name,
            latitude: trimmedLat,
            longitude: trimmedLong,
            polygonID,
        });

        return { spot: insertedSpot };
    }
}
