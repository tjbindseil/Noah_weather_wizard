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

        // TODO delete is actually a bit more complicated,
        // if there is no more spots looking at it, we should delete the s3 folder and its contents
        // -- OR --
        // we could do that in the background as part of the updating of the cache
        //
        // ...
        //
        // while im at it, it could be helpful to delete duplicate rows in the spot table?
        return {};
    }
}
