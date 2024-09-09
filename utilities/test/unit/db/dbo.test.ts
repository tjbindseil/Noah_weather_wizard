import { get_app_config } from 'ww-3-app-config-tjb';
import { Client } from 'ts-postgres';
import { createPool } from 'generic-pool';
import { Polygon, Spot } from 'ww-3-models-tjb';
import {
    deleteSpot,
    getPolygons,
    getSpot,
    getSpots,
    insertPolygon,
    insertSpot,
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

    const longsPeakSpot: PostedSpot = {
        name: 'Longs Peak',
        latitude: 40.255014,
        longitude: -105.615115,
        polygonID: 'abc',
    };
    const crestoneNeedleSpot: PostedSpot = {
        name: 'Crestone Needle',
        latitude: 37.964722,
        longitude: -105.576675,
        polygonID: 'def',
    };
    const mtWhitneySpot: PostedSpot = {
        name: 'Mount Whitney',
        latitude: 36.578581,
        longitude: -118.291995,
        polygonID: 'ghi',
    };
    const expectedSpots = [longsPeakSpot, crestoneNeedleSpot, mtWhitneySpot];
    const spotIds: number[] = [];

    const polygon1: Polygon = {
        id: 'ABC',
        forecastURL: 'http://ABC.com',
    };
    const polygon2: Polygon = {
        id: 'DEF',
        forecastURL: 'http://DEF.com',
    };
    const expectedPolygons = [polygon1, polygon2];

    beforeAll(async () => {
        pgClient = await pool.acquire();

        const spots = await getSpots(pgClient);
        if (spots.length > 0) {
            throw Error('Unit test spot table is not empty! Abandoning tests');
        }
        const polygons = await getPolygons(pgClient);
        if (polygons.length > 0) {
            throw Error(
                'Unit test polygon table is not empty! Abandoning tests'
            );
        }
    });

    beforeEach(async () => {
        spotIds.length = 0;
        for (let i = 0; i < expectedSpots.length; ++i) {
            const spotWithId = await insertSpot(pgClient, expectedSpots[i]);
            spotIds.push(spotWithId.id);
        }
        for (let i = 0; i < expectedPolygons.length; ++i) {
            await insertPolygon(
                pgClient,
                expectedPolygons[i].id,
                expectedPolygons[i].forecastURL
            );
        }
    });

    it('can insert a spot', async () => {
        const initialSpots = await getSpots(pgClient);
        expect(initialSpots.length).toEqual(expectedSpots.length);

        const grandTetonSpot = {
            name: 'Grand Teton',
            latitude: 43.741208,
            longitude: -110.802414,
            polygonID: 'jkl',
        };

        await insertSpot(pgClient, grandTetonSpot);

        const finalSpots = await getSpots(pgClient);
        expect(finalSpots.length).toEqual(expectedSpots.length + 1);
    });

    it('can get all spots', async () => {
        const initialSpots = await getSpots(pgClient);
        expect(initialSpots.length).toEqual(expectedSpots.length);
    });

    it('can delete a spot', async () => {
        const initialSpots = await getSpots(pgClient);
        expect(initialSpots.length).toEqual(expectedSpots.length);

        await deleteSpot(pgClient, initialSpots[0].id);

        const finalSpots = await getSpots(pgClient);
        expect(finalSpots.length).toEqual(expectedSpots.length - 1);
    });

    it('can post and get polygons', async () => {
        const initialPolygons = await getPolygons(pgClient);
        expect(initialPolygons.length).toEqual(expectedPolygons.length);

        const polygon3 = {
            id: 'GHI',
            forecastURL: 'http://JKL.com',
        };

        await insertPolygon(pgClient, polygon3.id, polygon3.forecastURL);

        const finalPolygons = await getPolygons(pgClient);
        expect(finalPolygons.length).toEqual(expectedPolygons.length + 1);
    });

    it('can get spots', async () => {
        const firstId = spotIds[0];

        const spot = await getSpot(pgClient, firstId);

        expect(spot.id).toEqual(firstId);
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
