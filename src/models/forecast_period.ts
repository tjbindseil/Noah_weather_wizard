export interface ForecastPeriod {
    readonly name: string;
    readonly temperature: number;
    readonly temperatureUnit: string;
    readonly probabilityOfPrecipitation: number;
    readonly windSpeed: number;
    readonly windDirection: string;
    readonly shortForecast: string;
    readonly detailedForecast: string;
    readonly iconUrl: string;
}
