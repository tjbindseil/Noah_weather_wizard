import { Client } from 'ts-postgres';
import { Polygon, Spot } from 'ww-3-models-tjb';

type PostedSpot = Omit<Spot, 'id'>;

export const insertSpot = async (pgClient: Client, spot: PostedSpot) => {
    const result = pgClient.query<Spot>(
        'insert into spot("name", "latitude", "longitude", "polygonID") values ($1, $2, $3, $4) returning *',
        [spot.name, spot.latitude, spot.longitude, spot.polygonID]
    );

    return await result.one();
};

export const getSpot = async (pgClient: Client, spotID: number) => {
    const result = pgClient.query<Spot>('SELECT * from spot where id = $1', [
        spotID,
    ]);
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

export const insertPolygon = async (
    pgClient: Client,
    polygonID: string,
    forecastURL: string
) => {
    const result = pgClient.query<Polygon>(
        'insert into polygon("id", "forecastURL") values ($1, $2) returning *',
        [polygonID, forecastURL]
    );

    return await result.one();
};

export const getPolygons = async (pgClient: Client) => {
    const result = pgClient.query<Polygon>('SELECT * FROM polygon');

    const polygons: Polygon[] = [];
    for await (const polygon of result) {
        polygons.push(polygon);
    }

    return polygons;
};
