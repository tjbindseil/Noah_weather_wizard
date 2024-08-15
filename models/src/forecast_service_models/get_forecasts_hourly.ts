import { ForecastHourly } from './forecast';
import { LatLong } from './lat_long';

export interface GetForecastsHourlyInput {
    points: LatLong[];
}

export interface GetForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
