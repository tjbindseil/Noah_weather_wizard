import { S3Client } from '@aws-sdk/client-s3';
import { Client } from 'ts-postgres';

export const mockSend = jest.fn();
export const mockS3Client = {
    send: mockSend,
} as unknown as S3Client;

export const bucketName = 'bucketName';
export const mockDbClient = {} as unknown as Client;
