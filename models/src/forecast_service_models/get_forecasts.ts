import { Forecast } from './forecast';

export interface GetForecastsInput {
    spotIDs: string; // comma separated list
}

export interface GetForecastsOutput {
    forecasts: Forecast[];
}
