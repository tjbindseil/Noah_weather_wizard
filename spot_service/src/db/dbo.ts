import { Client } from 'ts-postgres';
import { Spot } from 'ww-3-models-tjb';

type PostedSpot = Omit<Spot, 'id'>;

export const insertSpot = async (pgClient: Client, spot: PostedSpot) => {
    const result = pgClient.query<Spot>(
        'insert into spot("name", "latitude", "longitude", "polygonID") values ($1, $2, $3, $4) returning *',
        [spot.name, spot.latitude, spot.longitude, spot.polygonID]
    );

    return await result.one();
};

export const getSpots = async (pgClient: Client) => {
    const result = pgClient.query<Spot>('SELECT * FROM spot');

    const spots: Spot[] = [];
    for await (const spot of result) {
        spots.push(spot);
    }

    return spots;
};

export const deleteSpot = async (pgClient: Client, id: number) => {
    const result = pgClient.query<Spot>(
        'DELETE FROM spot WHERE id = $1 returning *',
        [id]
    );

    return await result.one();
};
