import { Client } from 'ts-postgres';
import { Spot } from 'ww-3-models-tjb';

type PostedSpot = Omit<Spot, 'id'>;

export const insertSpot = async (pgClient: Client, spot: PostedSpot) => {
    const result = pgClient.query<Spot>(
        'insert into spot("name", "latitude", "longitude", "polygonID", "gridX", "gridY") values ($1, $2, $3, $4, $5, $6) returning *',
        [
            spot.name,
            spot.latitude,
            spot.longitude,
            spot.polygonID,
            spot.gridX,
            spot.gridY,
        ]
    );

    return await result.one();
};

export const getSpot = async (pgClient: Client, spotID: number) => {
    const result = pgClient.query<Spot>('SELECT * from spot where id = $1', [
        spotID,
    ]);
    return await result.one();
};

export const getAllSpots = async (pgClient: Client) => {
    const result = pgClient.query<Spot>('SELECT * FROM spot');

    const spots: Spot[] = [];
    for await (const spot of result) {
        spots.push(spot);
    }

    return spots;
};

export const getSpots = async (
    pgClient: Client,
    minLat: number,
    maxLat: number,
    minLong: number,
    maxLong: number
) => {
    const result = pgClient.query<Spot>(
        'SELECT * FROM spot where latitude > $1 and latitude < $2 and longitude > $3 and longitude < $4 ',
        [minLat, maxLat, minLong, maxLong]
    );

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
