import { Forecast } from './forecast';
import { LatLong } from './lat_long';

export interface GetForecastsInput {
    points: LatLong[];
}

export interface GetForecastsOutput {
    forecasts: Forecast[];
}
