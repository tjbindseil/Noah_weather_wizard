export interface ForecastHourly {
    units: string;
    elevation: {
        unitCode: string;
        value: number;
    };
    periods: Period[];
    generatedAt: string;
    updateTime: string;
}

export interface HourlyPeriod {
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
        value: number | null;
    };
    relativeHumidity: {
        unitCode: string;
        value: number | null;
    };
    windSpeed: string;
    windDirection: string;
    icon: string;
    shortForecast: string;
    detailedForecast: string;
}
// TODO these two are the same
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
        value: number | null; // TODO wtf does null mean here?
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
        value: number;
    };
    periods: Period[];
    generatedAt: string;
    updateTime: string;
}
