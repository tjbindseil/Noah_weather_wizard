import { get_app_config } from 'ww-3-app-config-tjb';
import {
    deleteSpot,
    getAllSpots,
    postSpot,
} from './api_helpers/spot_service_api';
import { DeleteSpotOutput } from 'ww-3-models-tjb';

describe('General integ tests', () => {
    const forecastServiceBaseUrl = `http://${
        get_app_config().forecastServiceHost
    }:${get_app_config().forecastServicePort}`;

    const spotsToDelete: number[] = [];

    it('posts a spot', async () => {
        const initialSpots = await getAllSpots();

        const postedSpot = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
        });
        spotsToDelete.push(postedSpot.spot.id);

        const finalSpots = await getAllSpots();
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

        const finalSpots = await getAllSpots();
        expect(
            finalSpots.spots.map((spot) => spot.id).includes(postedSpot.spot.id)
        ).toBeFalsy();
    });

    it('gets all spots', async () => {});
    it('gets forecasts for spots', async () => {});

    afterAll(async () => {
        const deletePromises: Promise<DeleteSpotOutput>[] = [];
        spotsToDelete.forEach((id) => deletePromises.push(deleteSpot(id)));
        await Promise.all(deletePromises);
    });

    // more advanced...
    // it updaters the forecasts in the background
    // it('fetches the spots forecast upon posting the spot', async () => {});
});
