import { Client } from 'ts-postgres';
import { Forecast, ForecastHourly } from 'ww-3-models-tjb';

// given a list of spotIDs
// get the (unique) list of polygon IDs (these are members of the spot table)
// then, get the forecasts where the polygonID is in the set
// TODO consider matching all spots
export const getForecasts = async (
    _pgClient: Client,
    _pointIDs: string
): Promise<Forecast[]> => {
    // ... hmm should we make multiple requests? nope, find max and min somehow?
    // const result = pgClient.query<Forecast>(
    // 'select * from forecast where
    return [];
    //     const result = pgClient.query<Spot>(
    //         'insert into spot("name", "latitude", "longitude") values ($1, $2, $3) returning *',
    //         [
    //             spot.name,
    //             spot.latitude,
    //             spot.longitude,
    //         ]
    //     );
    //
    //     return await result.one();
};

export const getForecastsHourly = async (
    _pgClient: Client,
    _pointIDs: string
): Promise<ForecastHourly[]> => {
    return [];
    //     const result = pgClient.query<Spot>(
    //         'insert into spot("name", "latitude", "longitude") values ($1, $2, $3) returning *',
    //         [
    //             spot.name,
    //             spot.latitude,
    //             spot.longitude,
    //         ]
    //     );
    //
    //     return await result.one();
};
