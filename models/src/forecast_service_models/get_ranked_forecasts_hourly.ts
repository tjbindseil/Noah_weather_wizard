import { ForecastHourly } from './forecast';
import { LatLong } from './lat_long';

export interface GetRankedForecastsHourlyInput {
    points: LatLong[];
    formulaID: number;
}

export interface GetRankedForecastsHourlyOutput {
    forecastsHourly: ForecastHourly[];
}
