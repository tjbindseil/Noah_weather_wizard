import { ForecastPeriod } from './forecast_period';

export class Forecast {
    constructor(
        public readonly elevation: number,
        public readonly periods: ForecastPeriod[]
    ) {}
}
