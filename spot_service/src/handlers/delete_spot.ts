import { DeleteSpotInput, DeleteSpotOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { deleteSpot } from 'ww-3-utilities-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class DeleteSpot extends LooselyAuthenticatedAPI<
    DeleteSpotInput,
    DeleteSpotOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.DeleteSpotInput);
    }

    public async process(
        input: DeleteSpotInput,
        pgClient: Client
    ): Promise<DeleteSpotOutput> {
        await deleteSpot(pgClient, input.id);

        return {};
    }
}
