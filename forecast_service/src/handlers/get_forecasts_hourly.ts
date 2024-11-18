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
import { getSpotToForecastKeyMap } from './utils';
import { ForecastKey, S3Adapter } from 'ww-3-utilities-tjb';

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
        const spotToForecastKeyMap = await getSpotToForecastKeyMap(
            pgClient,
            input.spotIDs
        );

        const spotToForecastHourlyMap = new Map<Spot, ForecastHourly>();

        const getForecastHourlyPromises: Promise<void>[] = [];

        const setForecastHourly = async (
            spot: Spot,
            forecastKey: ForecastKey
        ) => {
            const forecastHourly = await this.s3Adapter.getForecastHourly(
                forecastKey
            );
            spotToForecastHourlyMap.set(spot, forecastHourly);
        };

        spotToForecastKeyMap.forEach((forecastKey, spot) => {
            getForecastHourlyPromises.push(
                setForecastHourly(spot, forecastKey)
            );
        });

        for (let i = 0; i < getForecastHourlyPromises.length; ++i) {
            await getForecastHourlyPromises[i];
        }

        const ret: GetForecastsHourlyOutput = {
            forecastsHourly: [],
        };
        spotToForecastHourlyMap.forEach((forecastHourly, spot) =>
            ret.forecastsHourly.push({
                spot,
                forecastHourly,
            })
        );

        return ret;
    }
}
