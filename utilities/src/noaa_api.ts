// TODO handle 5 second wait and retry when issues arise

import { _schema, Forecast } from 'ww-3-models-tjb';
import { ForecastKey } from './forecast_key';

import Ajv from 'ajv';
import { APIError } from 'ww-3-api-tjb';

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

export const getForecast = async (
    forecastKey: ForecastKey
    /* eslint-disable  @typescript-eslint/no-explicit-any */
): Promise<[Forecast, any]> => {
    const fetchResult = (await (
        await fetch(forecastKey.getForecastUrl(), {
            method: 'GET',
        })
    )
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        .json()) as { properties: any; geometry: any };

    const ajv = new Ajv({ strict: false });
    const validator = ajv.compile(_schema.Forecast);
    if (!validator(fetchResult.properties)) {
        console.log(
            `forecastKey is: ${JSON.stringify(
                forecastKey
            )} validator.errors is: ${JSON.stringify(validator.errors)}`
        );
        console.error(
            `invalid forecast object: ${JSON.stringify(fetchResult.properties)}`
        );
        throw new APIError(500, 'forecast fetched from noaa is not valid');
    }

    const forecast = fetchResult.properties as Forecast;

    return [forecast, fetchResult.geometry];
};
