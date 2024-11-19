import {
    ForecastHourly,
    GetForecastsHourlyInput,
    GetForecastsHourlyOutput,
    Spot,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
// import { getSpotToForecastKeyMap } from './utils';
import { ForecastKey, getSpot, S3Adapter } from 'ww-3-utilities-tjb';

export class GetForecastsHourly extends LooselyAuthenticatedAPI<
    GetForecastsHourlyInput,
    GetForecastsHourlyOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetForecastsHourlyInput);
    }

    constructor(private readonly s3Adapter: S3Adapter) {
        super();
    }

    public async process(
        input: GetForecastsHourlyInput,
        pgClient: Client
    ): Promise<GetForecastsHourlyOutput> {
        const spotIds: number[] = input.spotIDs
            .split(',')
            .map((str) => parseFloat(str));

        // const spotPromises: Promise<Spot>[] = [];
        const promises: Promise<{
            spot: Spot;
            forecastHourly: ForecastHourly;
        }>[] = [];
        for (let i = 0; i < spotIds.length; ++i) {
            promises.push(
                getSpot(pgClient, spotIds[i]).then(async (spot) => {
                    const fk = new ForecastKey(
                        spot.polygonID,
                        spot.gridX,
                        spot.gridY
                    );
                    const forecastHourly =
                        await this.s3Adapter.getForecastHourly(fk);
                    return {
                        spot,
                        forecastHourly,
                    };
                })
            );
        }

        const ret = await Promise.all(promises);
        //     const spots = await Promise.all(spotPromises)
        //     spots.map(spot => ({
        //       spot,
        //       forecastHourly:

        //     const spotPromises: Promise<Spot>[] = [];
        //     for (let i = 0; i < spotIds.length; ++i) {
        //         spotPromises.push(getSpot(pgClient, spotIds[i]));
        //     }
        //     const spotToForecastKeyMap = new Map<Spot, ForecastKey>();
        //     (await Promise.all(spotPromises)).forEach((spot) =>
        //         spotToForecastKeyMap.set(
        //             spot,
        //             new ForecastKey(spot.polygonID, spot.gridX, spot.gridY)
        //         )
        //     );
        //     return spotToForecastKeyMap;
        //
        //         const spotToForecastKeyMap = await getSpotToForecastKeyMap(
        //             pgClient,
        //             input.spotIDs
        //         );
        //
        //         const spotToForecastHourlyMap = new Map<Spot, ForecastHourly>();
        //
        //         const getForecastHourlyPromises: Promise<void>[] = [];
        //
        //         const setForecastHourly = async (
        //             spot: Spot,
        //             forecastKey: ForecastKey
        //         ) => {
        //             try {
        //                 const forecastHourly = await this.s3Adapter.getForecastHourly(
        //                     forecastKey
        //                 );
        //                 spotToForecastHourlyMap.set(spot, forecastHourly);
        //             } catch (e: unknown) {
        //                 console.error(`e is: ${e}`);
        //                 throw new APIError(
        //                     500,
        //                     'issue getting hourly forecast in helper func'
        //                 );
        //             }
        //         };
        //
        //         spotToForecastKeyMap.forEach((forecastKey, spot) => {
        //             getForecastHourlyPromises.push(
        //                 setForecastHourly(spot, forecastKey)
        //             );
        //         });
        //
        //         for (let i = 0; i < getForecastHourlyPromises.length; ++i) {
        //             // throw new Error('@@ @@ MANUAL ERROR');
        //             try {
        //                 await getForecastHourlyPromises[i];
        //             } catch (e: unknown) {
        //                 console.error(`e is: ${e}`);
        //                 throw new APIError(500, 'issue getting hourly forecast');
        //             }
        //         }

        //         const ret: GetForecastsHourlyOutput = {
        //             forecastsHourly: [],
        //         };
        //         spotToForecastHourlyMap.forEach((forecastHourly, spot) =>
        //             ret.forecastsHourly.push({
        //                 spot,
        //                 forecastHourly,
        //             })
        //         );

        return {
            forecastsHourly: ret,
        };
    }
}
