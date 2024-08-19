import { Forecast } from './forecast';

export interface GetForecastsInput {
    pointIDs: number[];
}

export interface GetForecastsOutput {
    forecasts: Forecast[];
}
