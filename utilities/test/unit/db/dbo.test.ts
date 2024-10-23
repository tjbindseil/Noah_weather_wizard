import { get_app_config } from 'ww-3-app-config-tjb';
import { Client } from 'ts-postgres';
import { createPool } from 'generic-pool';
import { Spot } from 'ww-3-models-tjb';
import {
    deleteSpot,
    getSpot,
    getAllSpots,
    insertSpot,
    getSpots,
} from '../../../src/db/dbo';

// these tests will actually interface with a pg database on my local machine
// see src/db/index.ts for a command to make the database

type PostedSpot = Omit<Spot, 'id'>;

describe('dbo tests', () => {
    let pgClient: Client;
    const pool = createPool(
        {
            create: async () => {
                const client = new Client(
                    get_app_config().spotDbConnectionConfig
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

    const ogCreator = 'OG_CREATOR';

    const longsPeakSpot: PostedSpot = {
        name: 'Longs Peak',
        latitude: 40.255014,
        longitude: -105.615115,
        polygonID: 'abc',
        gridX: 4,
        gridY: 5,
        creator: ogCreator,
    };
    const crestoneNeedleSpot: PostedSpot = {
        name: 'Crestone Needle',
        latitude: 37.964722,
        longitude: -105.576675,
        polygonID: 'def',
        gridX: 6,
        gridY: 7,
        creator: ogCreator,
    };
    const mtWhitneySpot: PostedSpot = {
        name: 'Mount Whitney',
        latitude: 36.578581,
        longitude: -118.291995,
        polygonID: 'ghi',
        gridX: 8,
        gridY: 9,
        creator: ogCreator,
    };
    const expectedSpots = [longsPeakSpot, crestoneNeedleSpot, mtWhitneySpot];
    const spotIds: number[] = [];

    beforeAll(async () => {
        pgClient = await pool.acquire();

        const spots = await getAllSpots(pgClient);
        if (spots.length > 0) {
            throw Error('Unit test spot table is not empty! Abandoning tests');
        }
    });

    beforeEach(async () => {
        spotIds.length = 0;
        for (let i = 0; i < expectedSpots.length; ++i) {
            const spotWithId = await insertSpot(pgClient, expectedSpots[i]);
            spotIds.push(spotWithId.id);
        }
    });

    it('can insert a spot', async () => {
        const initialSpots = await getAllSpots(pgClient);
        expect(initialSpots.length).toEqual(expectedSpots.length);

        const grandTetonSpot = {
            name: 'Grand Teton',
            latitude: 43.741208,
            longitude: -110.802414,
            polygonID: 'jkl',
            gridX: 10,
            gridY: 11,
            creator: ogCreator,
        };

        await insertSpot(pgClient, grandTetonSpot);

        const finalSpots = await getAllSpots(pgClient);
        expect(finalSpots.length).toEqual(expectedSpots.length + 1);
    });

    it('can get all spots', async () => {
        const initialSpots = await getAllSpots(pgClient);
        expect(initialSpots.length).toEqual(expectedSpots.length);
    });

    it('can delete a spot', async () => {
        const initialSpots = await getAllSpots(pgClient);
        expect(initialSpots.length).toEqual(expectedSpots.length);

        await deleteSpot(pgClient, initialSpots[0].id);

        const finalSpots = await getAllSpots(pgClient);
        expect(finalSpots.length).toEqual(expectedSpots.length - 1);
    });

    it('can get spots', async () => {
        const firstId = spotIds[0];

        const spot = await getSpot(pgClient, firstId);

        expect(spot.id).toEqual(firstId);
    });

    it('can get spots given a bounding lat/long box', async () => {
        const minLat = 37;
        const maxLat = 41;
        const minLong = -106;
        const maxLong = -104;

        const spots = await getSpots(
            pgClient,
            minLat,
            maxLat,
            minLong,
            maxLong
        );

        // shouldn't have whitney
        expect(spots.length).toEqual(2);
        expect(
            spots.map((spot) => spot.name).includes('Longs Peak')
        ).toBeTruthy();
        expect(
            spots.map((spot) => spot.name).includes('Crestone Needle')
        ).toBeTruthy();
    });

    afterEach(async () => {
        await pgClient.query<Spot>('TRUNCATE spot');
        await pgClient.query<Spot>('TRUNCATE polygon');
    });

    afterAll(async () => {
        await pool.release(pgClient);
        pool.drain().then(() => pool.clear());
    });
});
