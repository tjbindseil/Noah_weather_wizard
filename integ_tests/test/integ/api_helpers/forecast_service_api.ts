import { get_app_config } from 'ww-3-app-config-tjb';
import { fetchWithError } from './fetch_with_error';
import { GetForecastsOutput } from 'ww-3-models-tjb';

const forecastServiceBaseUrl = `http://${
    get_app_config().forecastServiceHost
}:${get_app_config().forecastServicePort}`;

export const getForecasts = async (spotIds: number[]) => {
    return await fetchWithError<GetForecastsOutput>(
        'getting forecasts',
        `${forecastServiceBaseUrl}/forecasts?` +
            new URLSearchParams({
                spotIDs: spotIds.map((spotId) => spotId.toString()),
            })
    );
};
