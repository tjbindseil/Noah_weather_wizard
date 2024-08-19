import {
    ForecastHourly,
    GetRankedForecastsHourlyInput,
    GetRankedForecastsHourlyOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecastsHourly } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { Processor } from '../processors/processor';

export class GetRankedForecastsHourly extends LooselyAuthenticatedAPI<
    GetRankedForecastsHourlyInput,
    GetRankedForecastsHourlyOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetRankedForecastsHourlyInput);
    }

    constructor(
        private readonly forecastHourlyProcessor: Processor<ForecastHourly>
    ) {
        super();
    }

    public async process(
        input: GetRankedForecastsHourlyInput,
        pgClient: Client
    ): Promise<GetRankedForecastsHourlyOutput> {
        return {
            forecastsHourly: this.forecastHourlyProcessor.rank(
                await getForecastsHourly(pgClient, input.pointIDs),
                input.formulaID
            ),
        };
    }
}
