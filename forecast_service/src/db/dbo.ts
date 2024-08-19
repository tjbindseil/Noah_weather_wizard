import { Client } from 'ts-postgres';
import { Forecast, ForecastHourly } from 'ww-3-models-tjb';

// given a list of locationIDs
// get the (unique) list of polygon IDs (these are members of the location table)
// then, get the forecasts where the polygonID is in the set
// TODO consider matching all locations
export const getForecasts = async (
    _pgClient: Client,
    _pointIDs: number[]
): Promise<Forecast[]> => {
    // ... hmm should we make multiple requests? nope, find max and min somehow?
    // const result = pgClient.query<Forecast>(
    // 'select * from forecast where
    return [];
    //     const result = pgClient.query<Location>(
    //         'insert into location("name", "latitude", "longitude") values ($1, $2, $3) returning *',
    //         [
    //             location_TODO_CHANGE.name,
    //             location_TODO_CHANGE.latitude,
    //             location_TODO_CHANGE.longitude,
    //         ]
    //     );
    //
    //     return await result.one();
};

export const getForecastsHourly = async (
    _pgClient: Client,
    _pointIDs: number[]
): Promise<ForecastHourly[]> => {
    return [];
    //     const result = pgClient.query<Location>(
    //         'insert into location("name", "latitude", "longitude") values ($1, $2, $3) returning *',
    //         [
    //             location_TODO_CHANGE.name,
    //             location_TODO_CHANGE.latitude,
    //             location_TODO_CHANGE.longitude,
    //         ]
    //     );
    //
    //     return await result.one();
};
