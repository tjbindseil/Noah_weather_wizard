import { Pool } from 'generic-pool';
import { Client } from 'ts-postgres';
import { getForecast, getPolygons, S3Adapter } from 'ww-3-utilities-tjb';

// factory for dependency inj?
export const make_fetch_forcast = (
    pool: Pool<Client>,
    s3Adapter: S3Adapter
) => {
    return () => fetch_forecast(pool, s3Adapter);
};

const fetch_forecast = async (pool: Pool<Client>, s3Adapter: S3Adapter) => {
    // fetch all polygons
    const pgClient = await pool.acquire();
    const polygons = await getPolygons(pgClient);
    await pool.release(pgClient);

    // for each polygon, fetch the forecast and post it up
    const promises: Promise<any>[] = [];
    for (let i = 0; i < polygons.length; ++i) {
        const curr = polygons[i];
        const [forecastJson, _geometryJson] = await getForecast(
            curr.forecastURL
        );

        // TODO here is another place where we would verify the geometry again

        promises.push(s3Adapter.putForecastJson(curr.id, forecastJson));
    }

    await Promise.all(promises);
};
