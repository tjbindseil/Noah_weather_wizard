import { bucketName, mockDbClient } from '../utils';
import { GetPictures } from '../../../src/handlers/index';

import { getPictures } from '../../../src/db/dbo';
import { GetPictures_WithValidatedUserSetter } from '../api_helper';
jest.mock('../../../src/db/dbo');
const mockGetPictures = jest.mocked(getPictures, true);

describe('GetPictures tests', () => {
    it('gets the pics', async () => {
        const getPictures = new GetPictures(bucketName);

        await getPictures.process({}, mockDbClient);

        expect(mockGetPictures).toBeCalledWith(mockDbClient, bucketName, '');
    });

    it('passes validatedUsername to dbo when it is present', async () => {
        const getPictures = new GetPictures_WithValidatedUserSetter(bucketName);
        const expectedValidatedUsername = 'expectedValidatedUsername';
        getPictures.setValidatedUsername(expectedValidatedUsername);

        await getPictures.process({}, mockDbClient);

        expect(mockGetPictures).toBeCalledWith(
            mockDbClient,
            bucketName,
            expectedValidatedUsername
        );
    });
});
