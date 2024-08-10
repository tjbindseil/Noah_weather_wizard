import { Client } from 'ts-postgres';
import { Location } from 'ww-3-models-tjb';

type PostedLocation = Omit<Location, 'id'>;

export const insertLocation = async (
    pgClient: Client,
    location: PostedLocation
) => {
    const result = pgClient.query<Location>(
        'insert into location("name", "latitude", "longitude") values ($1, $2, $3) returning *',
        [location.name, location.latitude, location.longitude]
    );

    return await result.one();
};

export const getLocations = async (pgClient: Client) => {
    const result = pgClient.query<Location>('SELECT * FROM location');

    const locations: Location[] = [];
    for await (const location of result) {
        locations.push(location);
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
