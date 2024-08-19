import { ForecastHourly } from './forecast';

export interface GetForecastsHourlyInput {
    pointIDs: number[];
}

export interface GetForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
