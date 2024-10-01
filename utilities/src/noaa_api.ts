// TODO handle 5 second wait and retry when issues arise

import { ForecastKey } from './forecast_key';

export const makeInitialCall = async (latitude: number, longitude: number) => {
    const noaaURL = `https://api.weather.gov/points/${latitude},${longitude}`;
    const fetchResult = (await (
        await fetch(noaaURL, {
            method: 'GET',
        })
    ).json()) as {
        properties: {
            gridId: string;
            gridX: number;
            gridY: number;
        };
    }; // TODO can I do this better?

    return new ForecastKey(
        fetchResult.properties.gridId,
        fetchResult.properties.gridX,
        fetchResult.properties.gridY
    );
};

export const getForecast = async (forecastKey: ForecastKey) => {
    const fetchResult = (await (
        await fetch(forecastKey.getKeyStr(), {
            method: 'GET',
        })
    )
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        .json()) as { properties: any; geometry: any };

    return [fetchResult.properties, fetchResult.geometry];
};
