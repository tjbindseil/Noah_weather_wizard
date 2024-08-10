import { Client } from 'ts-postgres';
import { selectPicture, deleteInvite } from '../../../src/db/dbo';
import { DeleteInvite_WithValidatedUserSetter } from '../api_helper';
import { Picture } from 'dwf-3-models-tjb';
import { APIError } from 'dwf-3-api-tjb';

jest.mock('../../../src/db/dbo');
const mockSelectPicture = jest.mocked(selectPicture, true);
const mockDeleteInvite = jest.mocked(deleteInvite, true);

describe('GetInvites tests', () => {
    const pictureId = 42;
    const requestor = 'requestor';
    const deleteInviteInput = {
        pictureId,
        invitee: 'invitee',
    };
    const mockPgClient = 'mockPgClient' as unknown as Client;

    const deleteInvite = new DeleteInvite_WithValidatedUserSetter();

    beforeEach(() => {
        mockSelectPicture.mockClear();
        mockSelectPicture.mockResolvedValue({
            createdBy: requestor,
        } as unknown as Picture);

        mockDeleteInvite.mockClear();

        deleteInvite.setValidatedUsername(requestor);
    });

    it('deletes the invite', async () => {
        await deleteInvite.process(deleteInviteInput, mockPgClient);

        expect(mockDeleteInvite).toHaveBeenCalledWith(
            mockPgClient,
            deleteInviteInput.pictureId,
            deleteInviteInput.invitee
        );
    });

    it('ensures the requestor owns the picture before deleting the invite', async () => {
        deleteInvite.setValidatedUsername(`NOT_${requestor}`);

        await expect(
            deleteInvite.process(deleteInviteInput, mockPgClient)
        ).rejects.toThrow(
            new APIError(
                403,
                'can only delete invites for pictures you have created'
            )
        );
    });
});
