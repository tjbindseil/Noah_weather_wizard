import { Forecast } from './forecast';
import { LatLong } from './lat_long';

export interface GetPossibleForecastsInput {
    points: LatLong[];
    criteriaID: number;
}

export interface GetPossibleForecastsOutput {
    forecasts: Forecast[];
}
