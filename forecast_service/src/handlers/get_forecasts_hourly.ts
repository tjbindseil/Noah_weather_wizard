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

        return {
            forecastsHourly: await Promise.all(promises),
        };
    }
}
