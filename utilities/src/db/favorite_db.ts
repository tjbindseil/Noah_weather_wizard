import { Client } from 'ts-postgres';

export interface Favorite {
    id: number;
    username: string;
    spotId: number;
}

export const insertFavorite = async (
    pgClient: Client,
    username: string,
    spotId: number
) => {
    const result = pgClient.query<Favorite>(
        'insert into favorite("username", "spotId") values ($1, $2) returning *',
        [username, spotId]
    );

    return await result.one();
};

export const getFavoritesByUsername = async (
    pgClient: Client,
    username: string
) => {
    const result = pgClient.query<Favorite>(
        'select * from favorite where "username" = $1',
        [username]
    );

    const favorites: Favorite[] = [];
    for await (const favorite of result) {
        favorites.push(favorite);
    }

    return favorites;
};

export const getAllFavoritesBySpot = async (
    pgClient: Client,
    spotId: number
) => {
    const result = pgClient.query<Favorite>(
        'select * from favorite where "spotId" = $1',
        [spotId]
    );

    const favorites: Favorite[] = [];
    for await (const favorite of result) {
        favorites.push(favorite);
    }

    return favorites;
};

export const deleteFavorite = async (
    pgClient: Client,
    username: string,
    spotId: number
) => {
    const result = pgClient.query<Favorite>(
        'delete from favorite where "username" = $1 and "spotId" = $2 returning *',
        [username, spotId]
    );

    return await result.one();
};
