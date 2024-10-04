import { Pool } from 'generic-pool';
import { Client } from 'ts-postgres';
import { S3Adapter } from 'ww-3-utilities-tjb';

export const make_fetch_forcast = (
    pool: Pool<Client>,
    s3Adapter: S3Adapter
) => {
    return () => fetch_forecast(pool, s3Adapter);
};

const fetch_forecast = async (_pool: Pool<Client>, _s3Adapter: S3Adapter) => {
    console.log('fetch_forecast is in limbo');
    //     // fetch all polygons
    //     const pgClient = await pool.acquire();
    //     const polygons = await getPolygons(pgClient);
    //     await pool.release(pgClient);
    //
    //     // for each polygon, fetch the forecast and post it up
    //     const promises: Promise<any>[] = [];
    //     for (let i = 0; i < polygons.length; ++i) {
    //         const curr = polygons[i];
    //         const [forecastJson, _geometryJson] = await getForecast(
    //             curr.forecastURL
    //         );
    //
    //         // TODO here is another place where we would verify the geometry again
    //
    //         promises.push(s3Adapter.putForecastJson(curr.id, forecastJson));
    //     }
    //
    //     await Promise.all(promises);
};

// TJTAG, ok, so bascally, we are tracking all poilkygons
// which is broken now becasuye polygons are not polygon + grid x and y
// so, either i
// A) add to polygon table st it tracks gridx and gridy in addition to polygon id
// or
// B) remove piolygon table, then fetch all spots, reduce down to only unique forecastKeys
//
// I/m goin with B
