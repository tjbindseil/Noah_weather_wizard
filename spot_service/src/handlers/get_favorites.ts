import {
    GetFavoritesInput,
    GetFavoritesOutput,
    Spot,
    _schema,
} from 'ww-3-models-tjb';
import { StrictlyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { getFavorites, getSpot } from 'ww-3-utilities-tjb';

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
        const favorites = await getFavorites(pgClient, this.validatedUsername);

        const favoriteSpots: Spot[] = [];
        const getSpotPromises: Promise<Spot>[] = [];
        favorites.forEach((f) =>
            getSpotPromises.push(getSpot(pgClient, f.spotId))
        );
        await Promise.all(getSpotPromises);

        return {
            favoriteSpots,
        };
    }
}
