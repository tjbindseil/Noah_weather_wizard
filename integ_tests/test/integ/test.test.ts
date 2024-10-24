import {
    testUser1,
    testUser2,
    testUser3,
    UserWithToken,
} from './setup/seedUsers';
import { getForecasts } from './api_helpers/forecast_service_api';
import { deleteSpot, getSpots, postSpot } from './api_helpers/spot_service_api';
import { DeleteSpotOutput, GetSpotsInput } from 'ww-3-models-tjb';
import { authorizeUser } from 'ww-3-user-facade-tjb';

describe('General integ tests', () => {
    const spotsToDelete: number[] = [];

    const longsPeakWindow: GetSpotsInput = {
        minLat: '39',
        maxLat: '41',
        minLong: '-106',
        maxLong: '-104',
    };

    beforeAll(async () => {
        const authPromises: Promise<void>[] = [];
        const authUserSaveToken = async (u: UserWithToken) => {
            u.token = (await authorizeUser(u.username, u.password)).AccessToken;
        };
        [testUser1, testUser2, testUser3].forEach((u) =>
            authPromises.push(authUserSaveToken(u))
        );
        await Promise.all(authPromises);
    });

    it('posts a spot', async () => {
        const initialSpots = await getSpots(longsPeakWindow);

        const postedSpot = await postSpot(
            {
                name: 'Longs Peak',
                latitude: 40.255014,
                longitude: -105.615115,
            },
            testUser1
        );
        spotsToDelete.push(postedSpot.spot.id);

        const finalSpots = await getSpots(longsPeakWindow);
        expect(
            initialSpots.spots
                .map((spot) => spot.id)
                .includes(postedSpot.spot.id)
        ).toBeFalsy();
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(postedSpot.spot.id)
        ).toBeTruthy();
    });

    it('deletes a spot when the requestor also created the spot', async () => {
        const postedSpot = await postSpot(
            {
                name: 'Longs Peak',
                latitude: 40.255014,
                longitude: -105.615115,
            },
            testUser1
        );

        await deleteSpot(postedSpot.spot.id, testUser1);

        const finalSpots = await getSpots(longsPeakWindow);
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(postedSpot.spot.id)
        ).toBeFalsy();
    });

    it('does not delete a spot when the requestor did not create the spot', async () => {
        const postedSpot = await postSpot(
            {
                name: 'Longs Peak',
                latitude: 40.255014,
                longitude: -105.615115,
            },
            testUser1
        );
        spotsToDelete.push(postedSpot.spot.id);

        // TODO catch exception
        await expect(deleteSpot(postedSpot.spot.id, testUser2)).rejects.toThrow(
            'fetch failed!'
        );

        const finalSpots = await getSpots(longsPeakWindow);
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(postedSpot.spot.id)
        ).toBeTruthy();
    });

    it('gets all spots given a lat/long window', async () => {
        const longsPeak = await postSpot(
            {
                name: 'Longs Peak',
                latitude: 40.255014,
                longitude: -105.615115,
            },
            testUser1
        );
        const mtWhitney = await postSpot(
            {
                name: 'Mount Whitney',
                latitude: 36.578581,
                longitude: -118.291995,
            },
            testUser1
        );
        spotsToDelete.push(longsPeak.spot.id);
        spotsToDelete.push(mtWhitney.spot.id);

        const finalSpots = await getSpots(longsPeakWindow);
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(longsPeak.spot.id)
        ).toBeTruthy();
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(mtWhitney.spot.id)
        ).toBeFalsy();
    });

    it('gets forecasts for spots', async () => {
        const longsPeak = await postSpot(
            {
                name: 'Longs Peak',
                latitude: 40.255014,
                longitude: -105.615115,
            },
            testUser1
        );
        const mtWhitney = await postSpot(
            {
                name: 'Mount Whitney',
                latitude: 36.578581,
                longitude: -118.291995,
            },
            testUser1
        );
        spotsToDelete.push(longsPeak.spot.id);
        spotsToDelete.push(mtWhitney.spot.id);

        const _forecasts = await getForecasts([
            longsPeak.spot.id,
            mtWhitney.spot.id,
        ]);
        // console.log(`forecasts is: ${JSON.stringify(forecasts)}`);
    });

    afterAll(async () => {
        const deletePromises: Promise<DeleteSpotOutput>[] = [];
        spotsToDelete.forEach((id) =>
            deletePromises.push(deleteSpot(id, testUser1))
        );
        await Promise.all(deletePromises);
    });

    // more advanced...
    // it updates the forecasts in the background
    // it('fetches the spots forecast upon posting the spot', async () => {});
});
