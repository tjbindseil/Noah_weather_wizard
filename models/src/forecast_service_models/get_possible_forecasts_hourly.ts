import { ForecastHourly } from './forecast';
import { LatLong } from './lat_long';

export interface GetPossibleForecastsHourlyInput {
    points: LatLong[];
    criteriaID: number;
}

export interface GetPossibleForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
