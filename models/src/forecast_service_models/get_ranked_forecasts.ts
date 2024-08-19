import { Forecast } from './forecast';

export interface GetRankedForecastsInput {
    pointIDs: number[];
    formulaID: number;
}

export interface GetRankedForecastsOutput {
    forecasts: Forecast[];
}
