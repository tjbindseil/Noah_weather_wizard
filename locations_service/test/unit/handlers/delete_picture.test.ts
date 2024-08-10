import { bucketName, mockDbClient, mockS3Client, mockSend } from '../utils';

import { deletePicture, selectPicture } from '../../../src/db/dbo';
import { Picture } from 'dwf-3-models-tjb';
import { DeletePicture_WithValidatedUserSetter } from '../api_helper';
import { APIError } from 'dwf-3-api-tjb';

jest.mock('../../../src/db/dbo');
const mockDeletePicture = jest.mocked(deletePicture, true);
const mockSelectPicture = jest.mocked(selectPicture, true);

describe('DeletePicture tests', () => {
    const pictureId = 42;
    const picture: Picture = {
        bucketName,
        key: 'key',
        id: pictureId,
        createdBy: 'createdBy',
        name: 'name',
        open: true,
    };

    let deletePicture: DeletePicture_WithValidatedUserSetter;
    beforeEach(() => {
        mockDeletePicture.mockClear();
        mockDeletePicture.mockResolvedValue(picture);
        mockSelectPicture.mockClear();
        mockSelectPicture.mockResolvedValue(picture);

        deletePicture = new DeletePicture_WithValidatedUserSetter(mockS3Client);
        deletePicture.setValidatedUsername(picture.createdBy);
    });

    it('deletes the pic from the DB', async () => {
        await deletePicture.process({ pictureId }, mockDbClient);

        expect(mockDeletePicture).toBeCalledWith(mockDbClient, pictureId);
    });

    it('deletes the pic from S3', async () => {
        await deletePicture.process({ pictureId }, mockDbClient);

        const args = mockSend.mock.calls[0];
        expect(args[0].input.Bucket).toEqual(picture.bucketName);
        expect(args[0].input.Key).toEqual(picture.key);
    });

    it('throws 403 if someone tries to delete someone else photo', async () => {
        deletePicture.setValidatedUsername(`NOT_${picture.createdBy}`);

        await expect(
            deletePicture.process({ pictureId }, mockDbClient)
        ).rejects.toThrow(new APIError(403, 'forbidden'));
    });
});
