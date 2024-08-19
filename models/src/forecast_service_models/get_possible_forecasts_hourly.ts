import { ForecastHourly } from './forecast';

export interface GetPossibleForecastsHourlyInput {
    pointIDs: number[];
    criteriaID: number;
}

export interface GetPossibleForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
