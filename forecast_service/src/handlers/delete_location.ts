import {
    DeleteLocationInput,
    DeleteLocationOutput,
    _schema,
} from 'ww-3-models-tjb';
import { StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { deleteLocation } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class DeleteLocation extends StrictlyAuthenticatedAPI<
    DeleteLocationInput,
    DeleteLocationOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.DeleteLocationInput);
    }

    public async process(
        input: DeleteLocationInput,
        pgClient: Client
    ): Promise<DeleteLocationOutput> {
        await deleteLocation(pgClient, input.id);

        return {};
    }
}
