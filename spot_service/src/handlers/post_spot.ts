import { PostSpotInput, PostSpotOutput, _schema } from 'ww-3-models-tjb';
import { LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { insertSpot } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import * as noaa_api from '../noaa_api';
import {
    HeadObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';

export class PostSpot extends LooselyAuthenticatedAPI<
    PostSpotInput,
    PostSpotOutput,
    Client
> {
    public provideInputValidationSchema(): ValidateFunction {
        return this.ajv.compile(_schema.PostSpotInput);
    }

    constructor(
        private readonly s3Client: S3Client,
        private readonly bucketName: string
    ) {
        super();
    }

    private trim(n: number) {
        return Number.parseFloat(n.toFixed(4));
    }

    public async process(
        input: PostSpotInput,
        pgClient: Client
    ): Promise<PostSpotOutput> {
        const trimmedLat = this.trim(input.latitude);
        const trimmedLong = this.trim(input.longitude);
        const [polygonID, forecastUrl] = await noaa_api.makeInitialCall(
            trimmedLat,
            trimmedLong
        );

        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.bucketName,
                    Key: `${polygonID}/forecast.json`,
                })
            );
        } catch (error: any) {
            if (error.name === 'NotFound') {
                const [forecastJson, geometryJson] = await noaa_api.getForecast(
                    forecastUrl
                );

                await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: this.bucketName,
                        Key: `${polygonID}/forecast.json`,
                        Body: forecastJson,
                        ContentType: 'json',
                    })
                );
                await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: this.bucketName,
                        Key: `${polygonID}/geometry.json`,
                        Body: geometryJson,
                        ContentType: 'json',
                    })
                );
            } else {
                throw error;
            }
        }

        const insertedSpot = await insertSpot(pgClient, {
            name: input.name,
            latitude: trimmedLat,
            longitude: trimmedLong,
            polygonID,
        });

        return { spot: insertedSpot };
    }
}
