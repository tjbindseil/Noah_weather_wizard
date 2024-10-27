import {
    DeleteFavoriteOutput,
    DeleteSpotOutput,
    GetFavoritesInput,
    GetFavoritesOutput,
    GetSpotsInput,
    GetSpotsOutput,
    PostFavoriteInput,
    PostFavoriteOutput,
    PostSpotInput,
    PostSpotOutput,
} from 'ww-3-models-tjb';
import { get_app_config } from 'ww-3-app-config-tjb';
import { fetchWithError } from './fetch_with_error';
import { UserWithTokens } from '../setup/seedUsers';

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

export const postSpot = async (input: PostSpotInput, creator: UserWithTokens) =>
    await fetchWithError<PostSpotOutput>(
        'posting spot',
        `${spotServiceBaseUrl}/spot`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${creator.accessToken}`,
            },
            body: JSON.stringify(input),
        }
    );

export const deleteSpot = async (id: number, deletor: UserWithTokens) =>
    await fetchWithError<DeleteSpotOutput>(
        `deleting spot (id: ${id} and creator: ${deletor.username})`,
        `${spotServiceBaseUrl}/spot`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${deletor.accessToken}`,
            },
            body: JSON.stringify({ id }),
        }
    );

export const getFavorites = async (
    _input: GetFavoritesInput,
    requestor: UserWithTokens
) => {
    return await fetchWithError<GetFavoritesOutput>(
        'getting favorites',
        `${spotServiceBaseUrl}/favorites`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${requestor.accessToken}`,
            },
        }
    );
};

export const postFavorite = async (
    input: PostFavoriteInput,
    creator: UserWithTokens
) =>
    await fetchWithError<PostFavoriteOutput>(
        'posting favorite',
        `${spotServiceBaseUrl}/favorite`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${creator.accessToken}`,
            },
            body: JSON.stringify(input),
        }
    );

export const deleteFavorite = async (spotId: number, deletor: UserWithTokens) =>
    await fetchWithError<DeleteFavoriteOutput>(
        'deleting favorite',
        `${spotServiceBaseUrl}/favorite`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${deletor.accessToken}`,
            },
            body: JSON.stringify({ spotId }),
        }
    );
