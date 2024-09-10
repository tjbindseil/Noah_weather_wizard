import { Forecast } from './forecast';

export interface GetPossibleForecastsInput {
    spotIDs: string; // comma separated list
    criteriaID: number;
}

export interface GetPossibleForecastsOutput {
    forecasts: Forecast[];
}
