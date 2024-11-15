import { getForecast, S3Adapter } from 'ww-3-utilities-tjb';

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
                    s3Adapter.putForecastJson(forecastKey, forecast);
                })
                .catch((e) => {
                    console.error(
                        `fetch_forecast: error getting forecast, e is: ${e}`
                    );
                })
        )
    );

    await Promise.all(promises);
};
