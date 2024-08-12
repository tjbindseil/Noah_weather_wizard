import {
    PostLocationInput,
    PostLocationOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { insertLocation } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class PostLocation extends LooselyAuthenticatedAPI<
    PostLocationInput,
    PostLocationOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostLocationInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: PostLocationInput,
        pgClient: Client
    ): Promise<PostLocationOutput> {
        const insertedLocation = await insertLocation(pgClient, {
            name: input.name,
            latitude: input.latitude,
            longitude: input.longitude,
        });

        return { location: insertedLocation };
    }
}
