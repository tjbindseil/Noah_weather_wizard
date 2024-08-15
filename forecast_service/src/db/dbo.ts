import { Client } from 'ts-postgres';
import { Location } from 'ww-3-models-tjb';

type PostedLocation = Omit<Location, 'id'>;

export const insertLocation = async (
    pgClient: Client,
    location_TODO_CHANGE: PostedLocation
) => {
    const result = pgClient.query<Location>(
        'insert into location("name", "latitude", "longitude") values ($1, $2, $3) returning *',
        [
            location_TODO_CHANGE.name,
            location_TODO_CHANGE.latitude,
            location_TODO_CHANGE.longitude,
        ]
    );

    return await result.one();
};

export const getLocations = async (pgClient: Client) => {
    const result = pgClient.query<Location>('SELECT * FROM location');

    const locations: Location[] = [];
    for await (const location_TODO_CHANGE of result) {
        locations.push(location_TODO_CHANGE);
    }

    return locations;
};

export const deleteLocation = async (pgClient: Client, id: number) => {
    const result = pgClient.query<Location>(
        'DELETE FROM location WHERE id = $1 returning *',
        [id]
    );

    return await result.one();
};
