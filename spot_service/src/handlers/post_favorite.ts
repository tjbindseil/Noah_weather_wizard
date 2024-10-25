import {
    PostFavoriteInput,
    PostFavoriteOutput,
    _schema,
} from 'ww-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { getFavorites, insertFavorite } from 'ww-3-utilities-tjb';

export class PostFavorite extends StrictlyAuthenticatedAPI<
    PostFavoriteInput,
    PostFavoriteOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostFavoriteInput);
    }

    public async process(
        { spotId }: PostFavoriteInput,
        pgClient: Client
    ): Promise<PostFavoriteOutput> {
        const existingFavorites = await getFavorites(
            pgClient,
            this.validatedUsername
        );
        const existingFavorite = existingFavorites.filter(
            (f) => f.username === this.validatedUsername && f.spotId === spotId
        );

        if (existingFavorite.length === 0) {
            await insertFavorite(pgClient, this.validatedUsername, spotId);
        } else if (existingFavorite.length > 1) {
            console.error(
                `user: ${this.validatedUsername} somehow has more than one (${existingFavorite.length}) favorite for spot: ${spotId}`
            );
            throw new APIError(500, 'issue tracking favorites');
        }

        return {};
    }
}
