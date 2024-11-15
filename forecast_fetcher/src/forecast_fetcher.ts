import { getForecast, S3Adapter } from 'ww-3-utilities-tjb';

export const make_fetch_forcast = (s3Adapter: S3Adapter) => {
    return () => fetch_forecast(s3Adapter);
};

const fetch_forecast = async (s3Adapter: S3Adapter) => {
    // fetch all polygons
    const forecastKeys = await s3Adapter.getAllPolygons();

    // for each polygon, fetch the forecast and post it up
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const promises: Promise<any>[] = [];

    forecastKeys.forEach((forecastKey) =>
        promises.push(
            getForecast(forecastKey).then(([forecast, _geometry]) => {
                s3Adapter.putForecastJson(forecastKey, forecast);
            })
        )
    );

    await Promise.all(promises);
};
