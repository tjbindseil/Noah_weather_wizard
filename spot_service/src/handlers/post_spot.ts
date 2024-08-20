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
        // first, check if polygon with this ID exists in db
        // if (!polygonInDatabase(polygonID)) {
        //   fetch forecast
        //   put polygon and forecast in database in same table
        //
        //   that s3 thing sounds kinda cool
        //   to make sure the data is randombly distributed, maybe hash the polygonID as it is the beginning of the key
        //   https://stackoverflow.com/questions/22167125/amazon-aws-s3-directory-structure-efficiency
        //   but not needed at first
        //
        //   // ... hmmm, forecast and polygon are 1:1
        //   // are they the same thing?
        // }
        const insertedSpot = await insertSpot(pgClient, {
            name: input.name,
            latitude: input.latitude,
            longitude: input.longitude,
            polygonID,
        });

        // first, check if polygon with this ID exists in db
        // if (!polygonInDatabase(polygonID)) {
        //   fetch forecast
        //   put polygon in database
        //   put forecast in database
        //
        //   // ... hmmm, forecast and polygon are 1:1
        //   // are they the same thing?
        // }

        return { spot: insertedSpot };
    }
}
