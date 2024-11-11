import { DeleteSpotInput, DeleteSpotOutput, _schema } from 'ww-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { deleteSpot, getSpot } from 'ww-3-utilities-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class DeleteSpot extends StrictlyAuthenticatedAPI<
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
        const spotToDelete = await getSpot(pgClient, input.id);
        if (this.validatedUsername != spotToDelete.creator) {
            throw new APIError(403, 'can only delete your own spots');
        }

        await deleteSpot(pgClient, input.id);

        return {};
    }
}
