import {
  GetLocationsInput,
  GetLocationsOutput,
  _schema,
} from "ww-3-models-tjb";
import { LooselyAuthenticatedAPI } from "ww-3-api-tjb";
import { getLocations } from "../db/dbo";
import { ValidateFunction } from "ajv";
import { Client } from "ts-postgres";

export class GetLocations extends LooselyAuthenticatedAPI<
  GetLocationsInput,
  GetLocationsOutput,
  Client
> {
  public provideInputValidationSchema(): ValidateFunction {
    return this.ajv.compile(_schema.GetLocationsInput);
  }

  constructor() {
    super();
  }

  public async process(
    _input: GetLocationsInput,
    pgClient: Client
  ): Promise<GetLocationsOutput> {
    return {
      locations: await getLocations(pgClient),
    };
  }
}
