import { PostSpotInput, PostSpotOutput, _schema } from 'ww-3-models-tjb';
import { APIError, LooselyAuthenticatedAPI } from 'ww-3-api-tjb';
import { insertSpot } from '../db/dbo';
import { ValidateFunction } from 'ajv';
import { Client } from 'ts-postgres';
import * as noaa_api from '../noaa_api';
import {
    GetObjectCommand,
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

    private trimLatLong(n: number) {
        return Number.parseFloat(n.toFixed(4));
    }

    public async process(
        input: PostSpotInput,
        pgClient: Client
    ): Promise<PostSpotOutput> {
        const trimmedLat = this.trimLatLong(input.latitude);
        const trimmedLong = this.trimLatLong(input.longitude);
        const [polygonID, forecastUrl] = await noaa_api.makeInitialCall(
            trimmedLat,
            trimmedLong
        );

        try {
            const existingGeometryResponse = await this.s3Client.send(
                new GetObjectCommand({
                    Bucket: this.bucketName,
                    Key: `${polygonID}/geometry.json`, // TODO geometry.Json is repeated
                })
            );
            console.log('@@ TJTAG @@ existing geometry found');

            // for now, we are checking existing geometry to make sure it doesn't change
            // this will ultimately be removed once it is clear that they don't change (fingers crossed)
            const [_forecastJson, geometryJson] = await noaa_api.getForecast(
                forecastUrl
            );

            const existingGeometry =
                existingGeometryResponse.Body?.transformToString;

            console.log(
                '@@ TJTAG @@ comparing existing geometryJson to newest geometryJson'
            );
            console.log(
                `@@ TJTAG @@ existing geometryJson: ${existingGeometry}`
            );
            console.log(`@@ TJTAG @@ fetched geometryJson: ${geometryJson}`);

            if (geometryJson !== existingGeometry) {
                console.error(
                    `HEADS UP! geometry for this polygon has changed. existing: ${existingGeometry} and fetched: ${geometryJson}`
                );
                throw new APIError(500, 'assumptions failed');
            }
        } catch (error: any) {
            if (error.name === 'NotFound') {
                console.log('@@ TJTAG @@ existing geometry not found');
                const [forecastJson, geometryJson] = await noaa_api.getForecast(
                    forecastUrl
                );

                await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: this.bucketName,
                        Key: `${polygonID}/forecast.json`,
                        Body: forecastJson,
                        ContentType: 'application/json; charset=utf-8',
                    })
                );
                await this.s3Client.send(
                    new PutObjectCommand({
                        Bucket: this.bucketName,
                        Key: `${polygonID}/geometry.json`,
                        Body: geometryJson,
                        ContentType: 'application/json; charset=utf-8',
                    })
                );
            } else {
                console.error('@@ TJTAG @@ other error...');
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
