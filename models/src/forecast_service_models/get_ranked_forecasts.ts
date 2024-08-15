import { Forecast } from './forecast';
import { LatLong } from './lat_long';

export interface GetRankedForecastsInput {
    points: LatLong[];
    formulaID: number;
}

export interface GetRankedForecastsOutput {
    forecasts: Forecast[];
}
