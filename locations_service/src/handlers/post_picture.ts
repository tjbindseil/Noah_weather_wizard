import { ValidateFunction } from 'ajv';
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import Jimp from 'jimp';
import { PostPictureInput, PostPictureOutput, _schema } from 'dwf-3-models-tjb';
import { StrictlyAuthenticatedAPI, APIError } from 'dwf-3-api-tjb';
import { Client } from 'ts-postgres';
import { insertPicture, pictureNameInUse } from '../db/dbo';

export class PostPicture extends StrictlyAuthenticatedAPI<
    PostPictureInput,
    PostPictureOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        const ret = this.ajv.compile(_schema.PostPictureInput);
        return ret;
    }

    constructor(
        private readonly bucketName: string,
        private readonly s3Client: S3Client
    ) {
        super();
    }

    public async process(
        input: PostPictureInput,
        pgClient: Client
    ): Promise<PostPictureOutput> {
        const { name, open } = input;

        if (await pictureNameInUse(pgClient, name, this.validatedUsername)) {
            throw new APIError(
                400,
                `user: ${this.validatedUsername} already has a picture named: ${name}`
            );
        }

        const filename = this.generatePictureFilename(
            name,
            this.validatedUsername
        );

        await this.makeNewPicture(filename, input.width, input.height);

        try {
            const ret = {
                picture: await insertPicture(pgClient, {
                    name,
                    createdBy: this.validatedUsername,
                    bucketName: this.bucketName,
                    key: filename,
                    open,
                }),
            };
            return ret;
        } catch (error: unknown) {
            this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: filename,
                })
            );
            throw error;
        }
    }

    private generatePictureFilename(
        pictureName: string,
        createdBy: string
    ): string {
        return `${pictureName}_by_${createdBy}.png`;
    }

    private async makeNewPicture(
        filename: string,
        width: number,
        height: number
    ) {
        // make blob
        const jimg = new Jimp(width, height);
        const arrayBuffer = new ArrayBuffer(width * height * 4);
        jimg.bitmap.data = Buffer.from(new Uint8ClampedArray(arrayBuffer));

        // set alpha to max for opagueness
        for (let i = 3; i < width * height * 4; i += 4) {
            jimg.bitmap.data[i] = 255;
        }

        // upload to s3
        console.log(
            `${new Date()} - PostPicure::makeNewPicture - sending put object request for filename: ${filename}`
        );
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: filename,
                Body: await jimg.getBufferAsync('image/png'),
                ContentType: 'image/png',
            })
        );
        console.log(
            `${new Date()} - PostPicure::makeNewPicture - done sending put object request for filename: ${filename}`
        );
    }
}
