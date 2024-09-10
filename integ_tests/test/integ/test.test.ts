import {
    DeleteSpotOutput,
    GetSpotsOutput,
    PostSpotOutput,
    Spot,
} from 'ww-3-models-tjb';

import { get_app_config } from 'ww-3-app-config-tjb';
import { fetchWithError } from './api_helpers/fetch_with_error';

describe('General integ tests', () => {
    const forecastServiceBaseUrl = `http://${
        get_app_config().forecastServiceHost
    }:${get_app_config().forecastServicePort}`;
    const spotServiceBaseUrl = `http://${get_app_config().spotServiceHost}:${
        get_app_config().spotServicePort
    }`;

    const getAllSpots = async () =>
        await fetchWithError<GetSpotsOutput>(
            'getting uts',
            `${spotServiceBaseUrl}/spots`
        );

    const postSpot = async (spot: Omit<Spot, 'id'>) =>
        await fetchWithError<PostSpotOutput>(
            'posting spot',
            `${spotServiceBaseUrl}/spot`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ spot }),
            }
        );
    const deleteSpot = async (id: number) =>
        await fetchWithError<DeleteSpotOutput>(
            'deleting spot',
            `${spotServiceBaseUrl}/spot`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            }
        );

    it('posts a spot', async () => {
        const initialSpots = await getAllSpots();

        const postedSpot = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
            polygonID: 'abc',
        });

        expect(
            initialSpots.spots
                .map((spot) => spot.id)
                .includes(postedSpot.spot.id)
        ).toBeFalsy();
    });

    it('deletes a spot', async () => {
        const postedSpot = await postSpot({
            name: 'Longs Peak',
            latitude: 40.255014,
            longitude: -105.615115,
            polygonID: 'abc',
        });

        await deleteSpot(postedSpot.spot.id);

        const finalSpots = await getAllSpots();
        expect(initialSpots.spots.length + 1).toEqual(finalSpots.spots.length);
    });

    it('gets all spots', async () => {});
    it('gets forecasts for spots', async () => {});
    // more advanced...
    // it updaters the forecasts in the background
    // it('fetches the spots forecast upon posting the spot', async () => {});
});