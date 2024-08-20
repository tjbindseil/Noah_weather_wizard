import { PostSpotInput, PostSpotOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { insertSpot } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import * as noaa_api from '../noaa_api';

export class PostSpot extends LooselyAuthenticatedAPI<
    PostSpotInput,
    PostSpotOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostSpotInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: PostSpotInput,
        pgClient: Client
    ): Promise<PostSpotOutput> {
        const polygonID = await noaa_api.getPolygonID(
            input.latitude,
            input.longitude
        );
        const insertedSpot = await insertSpot(pgClient, {
            name: input.name,
            latitude: input.latitude,
            longitude: input.longitude,
            polygonID,
        });

        return { spot: insertedSpot };
    }
}
