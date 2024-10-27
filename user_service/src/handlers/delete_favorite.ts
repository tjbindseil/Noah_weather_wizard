import {
    DeleteFavoriteInput,
    DeleteFavoriteOutput,
    _schema,
} from 'ww-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { deleteFavorite } from 'ww-3-utilities-tjb';

export class DeleteFavorite extends StrictlyAuthenticatedAPI<
    DeleteFavoriteInput,
    DeleteFavoriteOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.DeleteFavoriteInput);
    }

    public async process(
        { spotId }: DeleteFavoriteInput,
        pgClient: Client
    ): Promise<DeleteFavoriteOutput> {
        try {
            await deleteFavorite(pgClient, this.validatedUsername, spotId);
            /* eslint-disable  @typescript-eslint/no-explicit-any */
        } catch (e: any) {
            if (e.message === 'Query returned an empty result') {
                // do nothing, it never existed to begin with
            } else {
                throw new APIError(
                    500,
                    `issue deleting favorite, spotId: ${spotId} username: ${this.validatedUsername}`
                );
            }
        }

        return {};
    }
}
