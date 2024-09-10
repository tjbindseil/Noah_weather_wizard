import { ForecastHourly } from './forecast';

export interface GetForecastsHourlyInput {
    spotIDs: string; // comma separated list
}

export interface GetForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
