export interface ForecastHourly {
    sunny_hourly: boolean;
}

export interface Period {
    number: number;
    name: string;
    startTime: string;
    endTime: string;
    isDaytime: boolean;
    temperature: number;
    temperatureUnit: string;
    temperatureTrend: string;
    probabilityOfPrecipitation: {
        unitCode: string;
        value: number;
    };
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
}

export interface Forecast {
    units: string;
    elevation: {
        unitCode: string;
        valud: number;
    };
    periods: Period[];
}
