import { Forecast } from './forecast';

export interface GetPossibleForecastsInput {
    pointIDs: number[];
    criteriaID: number;
}

export interface GetPossibleForecastsOutput {
    forecasts: Forecast[];
}
