import { ForecastHourly } from './forecast';

export interface GetPossibleForecastsHourlyInput {
    spotIDs: string; // comma separated list
    criteriaID: number;
}

export interface GetPossibleForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
