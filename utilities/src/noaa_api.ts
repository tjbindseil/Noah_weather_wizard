import { _schema, Forecast, ForecastHourly, GridInfo } from 'ww-3-models-tjb';
import { ForecastKey } from './forecast_key';
import { APIError, validate, waitForMS } from 'ww-3-api-tjb';

async function fetchWithRetry<T>(fetchFunc: () => Promise<T>, numTries = 5) {
    let numTried = 0;
    while (numTried < numTries) {
        try {
            return await fetchFunc();
        } catch (e: unknown) {
            console.error(
                `fetchWithRetry, issue fetching, numTried is: ${numTried} e is: ${e}`
            );
        }

        console.error('fetchWithRetry, waiting 5 seconds and retrying');
        await waitForMS(5000);
        ++numTried;
    }

    throw new APIError(500, 'fetch with retry, ran out of attempts');
}

export const getForecastKey = async (
    latitude: number,
    longitude: number
): Promise<ForecastKey> => {
    const noaaURL = `https://api.weather.gov/points/${latitude},${longitude}`;

    return await fetchWithRetry<ForecastKey>(async () => {
        const fetchResult = await (
            await fetch(noaaURL, {
                method: 'GET',
            })
        ).json();

        const validatedGridInfo = validate<GridInfo>(
            _schema.GridInfo,
            fetchResult.properties
        );

        return new ForecastKey(
            validatedGridInfo.gridId,
            validatedGridInfo.gridX,
            validatedGridInfo.gridY
        );
    });
};

export const getForecast = async (
    forecastKey: ForecastKey
): Promise<Forecast> => {
    return await fetchWithRetry<Forecast>(async () => {
        const fetchResult = await (
            await fetch(forecastKey.getForecastUrl(), {
                method: 'GET',
            })
        ).json();

        const validatedForecast = validate<Forecast>(
            _schema.Forecast,
            fetchResult.properties
        );

        return validatedForecast;
    });
};

export const getForecastHourly = async (
    forecastKey: ForecastKey
): Promise<ForecastHourly> => {
    return await fetchWithRetry<ForecastHourly>(async () => {
        const fetchResult = await (
            await fetch(forecastKey.getForecastHourlyUrl(), {
                method: 'GET',
            })
        ).json();

        const validatedForecastHourly = validate<ForecastHourly>(
            _schema.ForecastHourly,
            fetchResult.properties
        );

        return validatedForecastHourly;
    });
};
