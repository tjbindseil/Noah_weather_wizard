import { GetSpotsInput, GetSpotsOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { getSpots } from 'ww-3-utilities-tjb';

export class GetSpots extends LooselyAuthenticatedAPI<
    GetSpotsInput,
    GetSpotsOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetSpotsInput);
    }

    constructor() {
        super();
    }

    public async process(
        input: GetSpotsInput,
        pgClient: Client
    ): Promise<GetSpotsOutput> {
        return {
            spots: await getSpots(
                pgClient,
                Number(input.minLat),
                Number(input.maxLat),
                Number(input.minLong),
                Number(input.maxLong)
            ),
        };
    }
}
