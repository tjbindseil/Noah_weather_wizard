import { fetchWithError } from './fetch_with_error';
import { GetForecastsHourlyOutput, GetForecastsOutput } from 'ww-3-models-tjb';
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

export const getForecastsHourly = async (spotIds: number[]) => {
    return await fetchWithError<GetForecastsHourlyOutput>(
        'getting hourly forecasts',
        `${baseUrl}/forecasts_hourly?` +
            new URLSearchParams({
                spotIDs: spotIds.map((spotId) => spotId.toString()),
            })
    );
};
