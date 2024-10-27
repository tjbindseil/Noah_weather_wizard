import {
    GetFavoritesInput,
    GetFavoritesOutput,
    Spot,
    _schema,
} from 'ww-3-models-tjb';
import { StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { getFavoritesByUsername, getSpot } from 'ww-3-utilities-tjb';

export class GetFavorites extends StrictlyAuthenticatedAPI<
    GetFavoritesInput,
    GetFavoritesOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetFavoritesInput);
    }

    public async process(
        _input: GetFavoritesInput,
        pgClient: Client
    ): Promise<GetFavoritesOutput> {
        const favorites = await getFavoritesByUsername(
            pgClient,
            this.validatedUsername
        );

        const favoriteSpots: Spot[] = [];
        const getSpotPromises: Promise<void>[] = [];
        const getAndSaveSpot = async (spotId: number) => {
            favoriteSpots.push(await getSpot(pgClient, spotId));
        };
        favorites.forEach((f) =>
            getSpotPromises.push(getAndSaveSpot(f.spotId))
        );
        await Promise.all(getSpotPromises);

        return {
            favoriteSpots,
        };
    }
}
