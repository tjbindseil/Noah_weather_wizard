import {
    DeleteSpotOutput,
    GetSpotsInput,
    GetSpotsOutput,
    PostSpotInput,
    PostSpotOutput,
} from 'ww-3-models-tjb';
import { get_app_config } from 'ww-3-app-config-tjb';
import { fetchWithError } from './fetch_with_error';
import { UserWithToken } from '../setup/seedUsers';

const spotServiceBaseUrl = `http://${get_app_config().spotServiceHost}:${
    get_app_config().spotServicePort
}`;

export const getSpots = async (getSpotsInput: GetSpotsInput) => {
    const minLatAsStr = getSpotsInput.minLat.toString();
    const maxLatAsStr = getSpotsInput.maxLat.toString();
    const minLongAsStr = getSpotsInput.minLong.toString();
    const maxLongAsStr = getSpotsInput.maxLong.toString();

    return await fetchWithError<GetSpotsOutput>(
        'getting uts',
        `${spotServiceBaseUrl}/spots?` +
            new URLSearchParams({
                minLat: minLatAsStr,
                maxLat: maxLatAsStr,
                minLong: minLongAsStr,
                maxLong: maxLongAsStr,
            })
    );
};

export const postSpot = async (input: PostSpotInput, creator: UserWithToken) =>
    await fetchWithError<PostSpotOutput>(
        'posting spot',
        `${spotServiceBaseUrl}/spot`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${creator.token}`,
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
