import { Spot } from '../spot_service_models/spot';
import { Forecast } from './forecast';

export interface GetForecastsInput {
    spotIDs: string; // comma separated list
}

interface SpotToForecast {
    spot: Spot;
    forecast: Forecast;
}

export interface GetForecastsOutput {
    forecasts: SpotToForecast[];
}
