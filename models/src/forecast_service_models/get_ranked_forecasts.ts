import { Forecast } from './forecast';

export interface GetRankedForecastsInput {
    spotIDs: string; // comma separated list
    formulaID: number;
}

export interface GetRankedForecastsOutput {
    forecasts: Forecast[];
}
