import { GetPicturesInput, GetPicturesOutput, _schema } from 'dwf-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'dwf-3-api-tjb';
import { getPictures } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';

export class GetPictures extends LooselyAuthenticatedAPI<
    GetPicturesInput,
    GetPicturesOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.GetPicturesInput);
    }

    constructor(private readonly bucketName: string) {
        super();
    }

    public async process(
        _input: GetPicturesInput,
        pgClient: Client
    ): Promise<GetPicturesOutput> {
        return {
            pictures: await getPictures(
                pgClient,
                this.bucketName,
                this.validatedUsername ?? ''
            ),
        };
    }
}
