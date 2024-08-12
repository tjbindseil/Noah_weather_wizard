import { get_app_config } from 'ww-3-app-config-tjb';
import { Client } from 'ts-postgres';
import { createPool } from 'generic-pool';
import { Location } from 'ww-3-models-tjb';
import {
    deleteLocation,
    getLocations,
    insertLocation,
} from '../../../src/db/dbo';

// these tests will actually interface with a pg database on my local machine
// see src/db/index.ts for a command to make the database

type PostedLocation = Omit<Location, 'id'>;

describe('dbo tests', () => {
    let pgClient: Client;
    const pool = createPool(
        {
            create: async () => {
                const client = new Client(
                    get_app_config().locationDbConnectionConfig
                );
                await client.connect();
                client.on('error', console.log);
                return client;
            },
            destroy: async (client: Client) => client.end(),
            validate: (client: Client) => {
                return Promise.resolve(!client.closed);
            },
        },
        {
            testOnBorrow: true,
            max: 1,
            min: 1,
        }
    );

    const longsPeakLocation: PostedLocation = {
        name: 'Longs Peak',
        latitude: 40.255014,
        longitude: -105.615115,
    };
    const crestoneNeedleLocation: PostedLocation = {
        name: 'Crestone Needle',
        latitude: 37.964722,
        longitude: -105.576675,
    };
    const mtWhitneyLocation: PostedLocation = {
        name: 'Mount Whitney',
        latitude: 36.578581,
        longitude: -118.291995,
    };
    const expectedLocations = [
        longsPeakLocation,
        crestoneNeedleLocation,
        mtWhitneyLocation,
    ];

    beforeAll(async () => {
        console.log('beforeAll start');
        pgClient = await pool.acquire();

        console.log('beforeAll middle');

        const locations = await getLocations(pgClient);
        if (locations.length > 0) {
            throw Error('Unit test table is not empty! Abandoning tests');
        }
        console.log('beforeAll end');
    });

    beforeEach(async () => {
        console.log('beforeEach start');
        for (let i = 0; i < expectedLocations.length; ++i) {
            await insertLocation(pgClient, expectedLocations[i]);
        }
        console.log('beforeEach end');
    });

    it('can insert a location', async () => {
        const initialLocations = await getLocations(pgClient);
        expect(initialLocations.length).toEqual(expectedLocations.length);

        const grandTetonLocation = {
            name: 'Grand Teton',
            latitude: 43.741208,
            longitude: -110.802414,
        };

        await insertLocation(pgClient, grandTetonLocation);

        const finalLocations = await getLocations(pgClient);
        expect(finalLocations.length).toEqual(expectedLocations.length + 1);
    });

    it('can get all locations', async () => {
        const initialLocations = await getLocations(pgClient);
        expect(initialLocations.length).toEqual(expectedLocations.length);
    });

    it('can delete a location', async () => {
        const initialLocations = await getLocations(pgClient);
        expect(initialLocations.length).toEqual(expectedLocations.length);

        await deleteLocation(pgClient, initialLocations[0].id);

        const finalLocations = await getLocations(pgClient);
        expect(finalLocations.length).toEqual(expectedLocations.length - 1);
    });

    afterEach(async () => {
        console.log('afterEach start');
        await pgClient.query<Location>('TRUNCATE location');
        console.log('afterEach end');
    });

    afterAll(async () => {
        await pool.release(pgClient);
        pool.drain().then(() => pool.clear());
    });
});
