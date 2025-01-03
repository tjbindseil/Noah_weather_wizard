import { Client } from 'ts-postgres';
import { Spot } from 'ww-3-models-tjb';
import {
    deleteSpot,
    getSpot,
    getAllSpots,
    insertSpot,
    getSpots,
} from '../../../src/db/spot_db';
import {
    deleteFavorite,
    getFavoritesBySpot,
    getFavoritesByUsername,
    insertFavorite,
} from '../../../src/db/favorite_db';
import { getPgClientPool } from '../../../src';
import { Pool } from 'generic-pool';

// these tests will actually interface with a pg database on my local machine
// see src/db/index.ts for a command to make the database

type PostedSpot = Omit<Spot, 'id'>;

describe('dbo tests', () => {
    let pgClient: Client;
    let pool: Pool<Client>;

    const ogCreator = 'OG_CREATOR';
    const otherCreator = 'OTHER_CREATOR';

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
    const otherCreatorSpot: PostedSpot = {
        name: 'other creator spot',
        latitude: 39.5,
        longitude: 40.5,
        polygonID: 'jkl',
        gridX: 10,
        gridY: 11,
        creator: otherCreator,
    };
    const expectedSpots = [
        longsPeakSpot,
        crestoneNeedleSpot,
        mtWhitneySpot,
        otherCreatorSpot,
    ];
    const spotIds: number[] = [];

    beforeAll(async () => {
        pool = await getPgClientPool();
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

    it('can insert favorites', async () => {
        const initialFavorites = await getFavoritesByUsername(
            pgClient,
            ogCreator
        );
        expect(initialFavorites.length).toEqual(0);
        await insertFavorite(pgClient, ogCreator, spotIds[0]);

        const favorites = await getFavoritesByUsername(pgClient, ogCreator);

        expect(favorites.length).toEqual(1);
    });

    it('can get favorites by username', async () => {
        await insertFavorite(pgClient, ogCreator, spotIds[0]);
        await insertFavorite(pgClient, ogCreator, spotIds[1]);

        const ogFavorites = await getFavoritesByUsername(pgClient, ogCreator);
        const otherFavorites = await getFavoritesByUsername(
            pgClient,
            otherCreator
        );

        expect(ogFavorites.length).toEqual(2);
        expect(otherFavorites.length).toEqual(0);
    });

    it('can get favorites by spotId', async () => {
        await insertFavorite(pgClient, ogCreator, spotIds[0]);
        await insertFavorite(pgClient, ogCreator, spotIds[1]);
        await insertFavorite(pgClient, otherCreator, spotIds[1]);

        const spot0Favorites = await getFavoritesBySpot(pgClient, spotIds[0]);
        const spot1Favorites = await getFavoritesBySpot(pgClient, spotIds[1]);

        expect(spot0Favorites.length).toEqual(1);
        expect(spot1Favorites.length).toEqual(2);
    });

    it('can delete favorites', async () => {
        await insertFavorite(pgClient, ogCreator, spotIds[0]);
        const favorites = await getFavoritesByUsername(pgClient, ogCreator);
        expect(favorites.length).toEqual(1);

        await deleteFavorite(pgClient, ogCreator, spotIds[0]);

        const favoritesAfterDelete = await getFavoritesByUsername(
            pgClient,
            ogCreator
        );
        expect(favoritesAfterDelete.length).toEqual(0);
    });

    it('cascades deletes to favorites', async () => {
        await insertFavorite(pgClient, ogCreator, spotIds[0]);
        const favorites = await getFavoritesByUsername(pgClient, ogCreator);
        expect(favorites.length).toEqual(1);

        await deleteSpot(pgClient, spotIds[0]);

        const favoritesAfterDelete = await getFavoritesByUsername(
            pgClient,
            ogCreator
        );
        expect(favoritesAfterDelete.length).toEqual(0);
    });

    afterEach(async () => {
        await pgClient.query('TRUNCATE favorite, spot CASCADE');
    });

    afterAll(async () => {
        await pool.release(pgClient);
        pool.drain().then(() => pool.clear());
    });
});
