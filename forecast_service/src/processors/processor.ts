import { Forecast, ForecastHourly } from 'ww-3-models-tjb';

export abstract class Processor<T> {
    public abstract rank(forecasts: T[], formulaID: number): T[];
    public abstract filter(forecasts: T[], criteriaID: number): T[];
}

export class ForecastProcessor extends Processor<Forecast> {
    public rank(_forecasts: Forecast[], _formulaID: number) {
        return [];
    }

    public filter(_forecasts: Forecast[], _criteriaID: number) {
        return [];
    }
}

export class ForecastHourlyProcessor extends Processor<ForecastHourly> {
    public rank(_forecastsHourly: ForecastHourly[], _formulaID: number) {
        return [];
    }

    public filter(_forecastsHourly: ForecastHourly[], _criteriaID: number) {
        return [];
    }
}
