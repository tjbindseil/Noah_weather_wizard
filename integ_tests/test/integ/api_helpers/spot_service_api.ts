import {
    DeleteSpotOutput,
    GetSpotsOutput,
    PostSpotInput,
    PostSpotOutput,
} from 'ww-3-models-tjb';
import { get_app_config } from 'ww-3-app-config-tjb';
import { fetchWithError } from './fetch_with_error';

const spotServiceBaseUrl = `http://${get_app_config().spotServiceHost}:${
    get_app_config().spotServicePort
}`;

export const getAllSpots = async () =>
    await fetchWithError<GetSpotsOutput>(
        'getting uts',
        `${spotServiceBaseUrl}/spots`
    );

export const postSpot = async (input: PostSpotInput) =>
    await fetchWithError<PostSpotOutput>(
        'posting spot',
        `${spotServiceBaseUrl}/spot`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );

export const deleteSpot = async (id: number) =>
    await fetchWithError<DeleteSpotOutput>(
        'deleting spot',
        `${spotServiceBaseUrl}/spot`,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        }
    );
