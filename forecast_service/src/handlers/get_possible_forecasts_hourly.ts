import {
    ForecastHourly,
    GetPossibleForecastsHourlyInput,
    GetPossibleForecastsHourlyOutput,
    _schema,
} from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { getForecastsHourly } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { Processor } from '../processors/processor';

export class GetPossibleForecastsHourly extends LooselyAuthenticatedAPI<
    GetPossibleForecastsHourlyInput,
    GetPossibleForecastsHourlyOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetPossibleForecastsHourlyInput);
    }

    constructor(
        private readonly forecastHourlyProcessor: Processor<ForecastHourly>
    ) {
        super();
    }

    public async process(
        input: GetPossibleForecastsHourlyInput,
        pgClient: Client
    ): Promise<GetPossibleForecastsHourlyOutput> {
        return {
            forecastsHourly: this.forecastHourlyProcessor.filter(
                await getForecastsHourly(pgClient, input.spotIDs),
                input.criteriaID
            ),
        };
    }
}
