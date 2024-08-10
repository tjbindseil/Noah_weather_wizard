import { Client } from 'ts-postgres';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Picture, PostInviteInput } from 'dwf-3-models-tjb';
import { postInvite, selectPicture } from '../../../src/db/dbo';
import { PostInvite_WithValidatedUserSetter } from '../api_helper';
import { APIError } from 'dwf-3-api-tjb';

jest.mock('../../../src/db/dbo');
const mockSelectPicture = jest.mocked(selectPicture, true);
const mockPostInvite = jest.mocked(postInvite, true);

describe('PostInvite tests', () => {
    const requestor = 'requestor';
    const mockPgClient = 'mockPgClient' as unknown as Client;
    const postInviteInput: PostInviteInput = {
        pictureId: 1,
        invitee: 'invitee',
        writeAccess: true,
    };

    const mockSend = jest.fn();
    const mockClient = {
        send: mockSend,
    } as unknown as CognitoIdentityProviderClient;

    const postInvite = new PostInvite_WithValidatedUserSetter(mockClient);

    beforeEach(() => {
        mockSend.mockClear();

        mockSelectPicture.mockClear();
        mockSelectPicture.mockResolvedValue({
            createdBy: requestor,
        } as unknown as Picture);

        mockPostInvite.mockClear();

        postInvite.setValidatedUsername(requestor);
    });

    it('checks the invitee is valid', async () => {
        await postInvite.process(postInviteInput, mockPgClient);

        const args = mockSend.mock.calls[0];
        expect(args[0].input.Username).toEqual(postInviteInput.invitee);
    });

    it('checks the picture was created by the requestor', async () => {
        postInvite.setValidatedUsername(`NOT_${requestor}`);

        await expect(
            postInvite.process(postInviteInput, mockPgClient)
        ).rejects.toThrow(
            new APIError(403, 'can only invite to pictures you have created')
        );
    });

    it('posts via the db', async () => {
        await postInvite.process(postInviteInput, mockPgClient);

        expect(mockPostInvite).toHaveBeenCalledWith(
            mockPgClient,
            postInviteInput.pictureId,
            postInviteInput.invitee,
            postInviteInput.writeAccess
        );
    });
});
