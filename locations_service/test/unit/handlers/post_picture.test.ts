import { Client } from 'ts-postgres';
import Jimp from 'jimp';
import { PostPictureInput } from 'dwf-3-models-tjb';

import { insertPicture, pictureNameInUse } from '../../../src/db/dbo';
import { bucketName, mockS3Client, mockSend } from '../utils';
import { APIError } from 'dwf-3-api-tjb';
import { PostPicture_WithValidatedUserSetter } from '../api_helper';

jest.mock('../../../src/db/dbo');
const mockInsertPicture = jest.mocked(insertPicture, true);
const mockPictureNameInUse = jest.mocked(pictureNameInUse, true);

describe('PostPictures tests', () => {
    const postPictureInput: PostPictureInput = {
        name: 'name',
        width: 420,
        height: 69,
        open: true,
    };
    const mockClient = {} as unknown as Client;

    const postPicture = new PostPicture_WithValidatedUserSetter(
        bucketName,
        mockS3Client
    );
    const validatedUsername = 'validatedUsername';
    postPicture.setValidatedUsername(validatedUsername);

    beforeEach(() => {
        mockSend.mockClear();
        mockInsertPicture.mockClear();
        mockPictureNameInUse.mockClear();
        mockPictureNameInUse.mockResolvedValue(false);
    });

    it('uploads the picture to S3', async () => {
        await postPicture.process(postPictureInput, mockClient);

        const args = mockSend.mock.calls[0];
        expect(args[0].input.Bucket).toEqual(bucketName);
        expect(args[0].input.ContentType).toEqual('image/png');
    });

    it('fills in alpha channel on new image', async () => {
        const width = postPictureInput.width;
        const height = postPictureInput.height;

        const jimg = new Jimp(width, height);
        const arrayBuffer = new ArrayBuffer(width * height * 4);
        jimg.bitmap.data = Buffer.from(new Uint8ClampedArray(arrayBuffer));

        // set alpha to max for opagueness
        for (let i = 3; i < width * height * 4; i += 4) {
            jimg.bitmap.data[i] = 255;
        }
        const expectedInputBody = await jimg.getBufferAsync('image/png');

        await postPicture.process(postPictureInput, mockClient);

        const args = mockSend.mock.calls[0];
        expect(args[0].input.Body).toEqual(expectedInputBody);
    });

    it('inserts the picture into the database', async () => {
        await postPicture.process(postPictureInput, mockClient);

        const args = mockInsertPicture.mock.calls[0];
        expect(args[0]).toEqual(mockClient);
        expect(args[1].name).toEqual(postPictureInput.name);
        expect(args[1].createdBy).toEqual(validatedUsername);
        expect(args[1].bucketName).toEqual(bucketName);
    });

    it('deletes the picture from S3 and rethrows if an error is thrown while inserting into the database', async () => {
        const expectedError = new Error('ERROR');
        mockInsertPicture.mockRejectedValue(expectedError);

        await expect(
            postPicture.process(postPictureInput, mockClient)
        ).rejects.toThrow(expectedError);

        // to find the generated filename
        const insertArgs = mockInsertPicture.mock.calls[0];
        const expectedKey = insertArgs[1].key;

        const args = mockSend.mock.calls[0];
        expect(args[0].input.Bucket).toEqual(bucketName);
        expect(args[0].input.Key).toEqual(expectedKey);
    });

    it('makes sure the picture name is not in use by the user and throws if it is', async () => {
        mockPictureNameInUse.mockResolvedValue(true);

        await expect(
            postPicture.process(postPictureInput, mockClient)
        ).rejects.toThrow(
            new APIError(
                400,
                `user: ${validatedUsername} already has a picture named: ${postPictureInput.name}`
            )
        );
    });
});
