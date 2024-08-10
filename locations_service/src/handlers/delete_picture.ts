import {
    DeletePictureInput,
    DeletePictureOutput,
    _schema,
} from 'dwf-3-models-tjb';
import { APIError, StrictlyAuthenticatedAPI } from 'dwf-3-api-tjb';
import { deletePicture, selectPicture } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class DeletePicture extends StrictlyAuthenticatedAPI<
    DeletePictureInput,
    DeletePictureOutput,
    Client
> {
    constructor(private readonly s3Client: S3Client) {
        super();
    }

    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.DeletePictureInput);
    }

    public async process(
        input: DeletePictureInput,
        pgClient: Client
    ): Promise<DeletePictureOutput> {
        const picToDelete = await selectPicture(pgClient, input.pictureId);

        if (this.validatedUsername !== picToDelete.createdBy) {
            console.error(
                `user: ${this.validatedUsername} is trying to delete someone else's (${picToDelete.createdBy}) photo`
            );
            throw new APIError(403, 'forbidden');
        }

        const deletedPic = await deletePicture(pgClient, input.pictureId);
        const s3DeleteResult = this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: deletedPic.bucketName,
                Key: deletedPic.key,
            })
        );

        // TODO if we fail to delete from s3, may need to cleanup
        console.log(`s3DeleteResult is: ${JSON.stringify(s3DeleteResult)}`);

        return {};
    }
}
