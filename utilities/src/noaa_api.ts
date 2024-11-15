// TODO handle 5 second wait and retry when issues arise

import { _schema, Forecast, GridInfo } from 'ww-3-models-tjb';
import { ForecastKey } from './forecast_key';
import { validate } from 'ww-3-api-tjb';

export const getForecastKey = async (latitude: number, longitude: number) => {
    const noaaURL = `https://api.weather.gov/points/${latitude},${longitude}`;
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
};

export const getForecast = async (
    forecastKey: ForecastKey
): Promise<Forecast> => {
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
};
