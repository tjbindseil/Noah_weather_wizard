import { ForecastHourly } from './forecast';

export interface GetRankedForecastsHourlyInput {
    pointIDs: number[];
    formulaID: number;
}

export interface GetRankedForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
