import { makeRequest } from '../makeRequest';
import { Forecast } from './forecast';
import { ForecastPeriod } from './forecast_period';

export class ForecastLocation {
    private forecast?: Forecast;
    // public readonly hourlyForecast: HourlyForecast;

    constructor(
        public readonly name: string,
        public readonly lat: number,
        public readonly long: number,
        public readonly forecastUrl: string,
        public readonly forecastHourlyUrl: string
    ) {}

    // lazy initialize the forecast
    public async getForecast() {
        if (!this.forecast) {
            const rawForecast = await makeRequest(this.forecastUrl);
            const periods = rawForecast.periods.map(
                (p: any) => ({ ...p } as ForecastPeriod)
            );
            this.forecast = new Forecast(rawForecast.elevation, periods);
        }
        return this.forecast;
    }

    public getHourlyForecast() {
        console.warn('getHourlyForecast not implemented yet');
    }
}
