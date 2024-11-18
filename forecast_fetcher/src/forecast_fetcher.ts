import { getForecast, getForecastHourly, S3Adapter } from 'ww-3-utilities-tjb';
import { publishMetric } from 'ww-3-api-tjb';

export class ForecastFetcher {
    constructor(private readonly s3Adapter: S3Adapter) {}

    public async fetchForecast() {
        const forecastKeys = await this.s3Adapter.getAllPolygons();
        const promises: Promise<void>[] = [];

        forecastKeys.forEach((forecastKey) =>
            promises.push(
                getForecast(forecastKey)
                    .then((forecast) => {
                        this.s3Adapter.putForecast(forecastKey, forecast);
                    })
                    .catch((e) => {
                        console.error(
                            `fetch_forecast: error getting forecast, e is: ${e}`
                        );
                        publishMetric('FORECAST_FETCHER_FAILED_FETCH', 1);
                    })
            )
        );

        await Promise.all(promises);
    }

    public async fetchForecastHourly() {
        const forecastKeys = await this.s3Adapter.getAllPolygons();
        const promises: Promise<void>[] = [];

        forecastKeys.forEach((forecastKey) =>
            promises.push(
                getForecastHourly(forecastKey)
                    .then((forecastHourly) => {
                        this.s3Adapter.putForecastHourly(
                            forecastKey,
                            forecastHourly
                        );
                    })
                    .catch((e) => {
                        console.error(
                            `fetch_forecast: error getting forecast, e is: ${e}`
                        );
                        publishMetric('FORECAST_FETCHER_FAILED_FETCH', 1);
                    })
            )
        );

        await Promise.all(promises);
    }
}
