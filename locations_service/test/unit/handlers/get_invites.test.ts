import { Client } from 'ts-postgres';
import {
    selectPicture,
    getInvitesByPictureId,
    getInvitesByInvitee,
} from '../../../src/db/dbo';
import { GetInvites_WithValidatedUserSetter } from '../api_helper';
import { Picture } from 'dwf-3-models-tjb';
import { APIError } from 'dwf-3-api-tjb';

jest.mock('../../../src/db/dbo');
const mockSelectPicture = jest.mocked(selectPicture, true);
const mockGetInvitesByPictureId = jest.mocked(getInvitesByPictureId, true);
const mockGetInvitesByInvitee = jest.mocked(getInvitesByInvitee, true);

describe('GetInvites tests', () => {
    const pictureId = '42';
    const pictureIdAsNumber = 42;
    const requestor = 'requestor';
    const mockPgClient = 'mockPgClient' as unknown as Client;

    const getInvites = new GetInvites_WithValidatedUserSetter();

    beforeEach(() => {
        mockSelectPicture.mockClear();
        mockSelectPicture.mockResolvedValue({
            createdBy: requestor,
        } as unknown as Picture);

        mockGetInvitesByPictureId.mockClear();
        mockGetInvitesByInvitee.mockClear();

        getInvites.setValidatedUsername(requestor);
    });

    it('gets invites by pictureId if its present in input', async () => {
        await getInvites.process({ pictureId }, mockPgClient);

        expect(mockGetInvitesByPictureId).toHaveBeenCalledWith(
            mockPgClient,
            pictureIdAsNumber
        );
    });

    it('ensures the requestor owns the picture before getting invites by picture', async () => {
        getInvites.setValidatedUsername(`NOT_${requestor}`);

        await expect(
            getInvites.process({ pictureId }, mockPgClient)
        ).rejects.toThrow(
            new APIError(
                403,
                'can only check invites by pictureId for pictures you have created'
            )
        );
    });

    it('gets invites by invitee if pictureId is absent in input', async () => {
        await getInvites.process({}, mockPgClient);

        expect(mockGetInvitesByInvitee).toHaveBeenCalledWith(
            mockPgClient,
            requestor
        );
    });
});
