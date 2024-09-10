import { ForecastHourly } from './forecast';

export interface GetRankedForecastsHourlyInput {
    spotIDs: string; // comma separated list
    formulaID: number;
}

export interface GetRankedForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
