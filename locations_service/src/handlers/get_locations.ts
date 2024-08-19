import { GetSpotsInput, GetSpotsOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getSpots } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

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
        _input: GetSpotsInput,
        pgClient: Client
    ): Promise<GetSpotsOutput> {
        return {
            spots: await getSpots(pgClient),
        };
    }
}
