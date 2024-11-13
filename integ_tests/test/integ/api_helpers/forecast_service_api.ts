import { fetchWithError } from './fetch_with_error';
import { GetForecastsOutput } from 'ww-3-models-tjb';
import { baseUrl } from '.';

export const getForecasts = async (spotIds: number[]) => {
    return await fetchWithError<GetForecastsOutput>(
        'getting forecasts',
        `${baseUrl}/forecasts?` +
            new URLSearchParams({
                spotIDs: spotIds.map((spotId) => spotId.toString()),
            })
    );
};
