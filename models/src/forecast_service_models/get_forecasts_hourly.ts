import { Spot } from '../spot_service_models/spot';
import { ForecastHourly } from './forecast';

export interface GetForecastsHourlyInput {
    spotIDs: string; // comma separated list
}

interface SpotToForecastHourly {
    spot: Spot;
    forecast: ForecastHourly;
}

export interface GetForecastsHourlyOutput {
    forecastsHourly: SpotToForecastHourly[];
}
