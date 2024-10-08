import { getForecasts } from './api_helpers/forecast_service_api';
import { deleteSpot, getSpots, postSpot } from './api_helpers/spot_service_api';
import { DeleteSpotOutput, GetSpotsInput } from 'ww-3-models-tjb';

describe('General integ tests', () => {
    const spotsToDelete: number[] = [];

    const longsPeakWindow: GetSpotsInput = {
        minLat: '39',
        maxLat: '41',
        minLong: '-106',
        maxLong: '-104',
    };

    it('posts a spot', async () => {
        const initialSpots = await getSpots(longsPeakWindow);

        const postedSpot = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
        });
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

    it('deletes a spot', async () => {
        const postedSpot = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
        });

        await deleteSpot(postedSpot.spot.id);

        const finalSpots = await getSpots(longsPeakWindow);
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(postedSpot.spot.id)
        ).toBeFalsy();
    });

    it('gets all spots given a lat/long window', async () => {
        const longsPeak = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
        });
        const mtWhitney = await postSpot({
            name: 'Mount Whitney',
            latitude: 36.578581,
            longitude: -118.291995,
        });
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
        const longsPeak = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
        });
        const mtWhitney = await postSpot({
            name: 'Mount Whitney',
            latitude: 36.578581,
            longitude: -118.291995,
        });
        spotsToDelete.push(longsPeak.spot.id);
        spotsToDelete.push(mtWhitney.spot.id);

        const forecasts = await getForecasts([
            longsPeak.spot.id,
            mtWhitney.spot.id,
        ]);
        console.log(`forecasts is: ${JSON.stringify(forecasts)}`);
    });

    afterAll(async () => {
        const deletePromises: Promise<DeleteSpotOutput>[] = [];
        spotsToDelete.forEach((id) => deletePromises.push(deleteSpot(id)));
        await Promise.all(deletePromises);
    });

    // more advanced...
    // it updaters the forecasts in the background
    // it('fetches the spots forecast upon posting the spot', async () => {});
});
