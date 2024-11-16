import { getForecast, S3Adapter } from 'ww-3-utilities-tjb';
import { publishMetric } from 'ww-3-api-tjb';

export const make_fetch_forcast = (s3Adapter: S3Adapter) => {
    return () => fetch_forecast(s3Adapter);
};

const fetch_forecast = async (s3Adapter: S3Adapter) => {
    const forecastKeys = await s3Adapter.getAllPolygons();
    const promises: Promise<void>[] = [];

    forecastKeys.forEach((forecastKey) =>
        promises.push(
            getForecast(forecastKey)
                .then((forecast) => {
                    console.log(
                        `fk is: ${forecastKey.getKeyStr()} and forecast is: ${JSON.stringify(
                            forecast
                        )}`
                    );
                    s3Adapter.putForecastJson(forecastKey, forecast);
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
};
