import { getForecast, getForecastHourly, S3Adapter } from 'ww-3-utilities-tjb';
import { publishMetric } from 'ww-3-api-tjb';

export class ForecastFetcher {
    constructor() {}

    public async fetchForecast(s3Adapter: S3Adapter) {
        console.log(`@@ @@ fetching forecast at: ${new Date().toISOString()}`);
        const forecastKeys = await s3Adapter.getAllPolygons();
        const promises: Promise<void>[] = [];

        forecastKeys.forEach((forecastKey) =>
            promises.push(
                getForecast(forecastKey)
                    .then((forecast) => {
                        s3Adapter.putForecast(forecastKey, forecast);
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
        console.log(
            `@@ @@ finished fetching forecast at: ${new Date().toISOString()}`
        );
    }

    public async fetchForecastHourly(s3Adapter: S3Adapter) {
        console.log(
            `@@ @@ fetching hourly forecast at: ${new Date().toISOString()}`
        );
        const forecastKeys = await s3Adapter.getAllPolygons();
        const promises: Promise<void>[] = [];

        forecastKeys.forEach((forecastKey) =>
            promises.push(
                getForecastHourly(forecastKey)
                    .then((forecastHourly) => {
                        s3Adapter.putForecastHourly(
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
        console.log(
            `@@ @@ finished fetching hourly forecast at: ${new Date().toISOString()}`
        );
    }
}
