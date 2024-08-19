import { PostSpotInput, PostSpotOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { insertSpot } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

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
        // first, take the lat/long and get some (polygon ID) from NOAA API

        const insertedSpot = await insertSpot(pgClient, {
            name: input.name,
            latitude: input.latitude,
            longitude: input.longitude,
        });

        return { spot: insertedSpot };
    }
}
