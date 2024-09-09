import {
    createPicture,
    listPictures,
    deletePicture,
    authUser,
    makePostPictureInput,
    deleteMultiplePictures,
    deleteMultipleInvites,
    sendInvite,
    getInvites,
    deleteInvite,
} from './api_helpers';
import {
    UserWithToken,
    testUser1,
    testUser2,
    testUser3,
} from './setup/seedUsers';
import { DeleteInviteInput, Picture } from 'dwf-3-models-tjb';

describe('PictureService integ tests', () => {
    const createdPictureIds: Map<number, UserWithToken> = new Map();
    const createdInviteIds: Map<DeleteInviteInput, UserWithToken> = new Map();

    // TODO this definitely shouldn't be duplicated
    // but...
    // running code before all tests happens in the global setup scripts
    // and data doesn't carry over.
    beforeAll(async () => {
        const authPromises: Promise<void>[] = [];
        [testUser1, testUser2, testUser3].forEach((u) =>
            authPromises.push(authUser(u))
        );
        await Promise.all(authPromises);
    });

    it('creates pictures', async () => {
        await createPicture(testUser1, 'creates_picture', createdPictureIds);
    });

    it('lists pictures', async () => {
        const output = await createPicture(
            testUser1,
            'lists_pictures',
            createdPictureIds
        );

        const afterPictures = await listPictures(testUser1);
        const afterListedPictureIds = afterPictures.pictures.map(
            (picture: Picture) => picture.id
        );

        expect(afterListedPictureIds.includes(output.picture.id)).toBeTruthy();
    });

    it('deletes pictures', async () => {
        const output = await createPicture(
            testUser1,
            'deletes_pictures',
            new Map() // don't track this id because we are cleaning it up ourselves
        );

        await deletePicture(testUser1, output.picture.id);
    });

    it('only gets closed photos if the requestor also created them', async () => {
        const testPicName = 'CLOSED_PIC_TEST_PIC';
        const privatePictureInput = makePostPictureInput(
            testUser1.username,
            testPicName,
            {}
        );
        await createPicture(
            testUser1,
            testPicName,
            createdPictureIds,
            privatePictureInput
        );

        const finalPicturesForTestUser1 = await listPictures(testUser1);
        const finalPicturesForTestUser2 = await listPictures(testUser2);

        const user1TestPicPresent =
            finalPicturesForTestUser1.pictures.find(
                (picture) => picture.name === testPicName
            ) !== undefined;
        const user2TestPicPresent =
            finalPicturesForTestUser2.pictures.find(
                (picture) => picture.name === testPicName
            ) !== undefined;

        // less flakey would be to ensure that finalPicturesForTestUser2 does not contian the new pic and
        // finalPicturesForTestUser1 does contain the new pic
        expect(user1TestPicPresent).toBeTruthy();
        expect(user2TestPicPresent).toBeFalsy();
    });

    it('allows users to invite other users to their closed pictures', async () => {
        const createPictureOutput = await createPicture(
            testUser1,
            'send_invite_test_pic',
            createdPictureIds
        );
        const createdPictureId = createPictureOutput.picture.id;

        await sendInvite(
            testUser1,
            {
                pictureId: createdPictureId,
                invitee: testUser2.username,
                writeAccess: true,
            },
            createdInviteIds
        );

        const getInvitesOutput = await getInvites(testUser1, {
            pictureId: String(createdPictureId),
        });

        expect(getInvitesOutput.invites.length).toEqual(1);
        const invite = getInvitesOutput.invites.at(0);
        expect(invite?.picture).toEqual(createdPictureId);
        expect(invite?.writeAccess).toEqual(true);
        expect(invite?.invitee).toEqual(testUser2.username);
    });

    it('deletes invites', async () => {
        const createPictureOutput = await createPicture(
            testUser1,
            'delete_invite_test_pic',
            createdPictureIds
        );
        const createdPictureId = createPictureOutput.picture.id;

        await sendInvite(
            testUser1,
            {
                pictureId: createdPictureId,
                invitee: testUser2.username,
                writeAccess: true,
            },
            new Map()
        );

        const output = await getInvites(testUser1, {
            pictureId: String(createdPictureId),
        });
        expect(output.invites.length).toEqual(1);

        await deleteInvite(testUser1, {
            pictureId: createdPictureId,
            invitee: testUser2.username,
        });

        const endOutput = await getInvites(testUser1, {
            pictureId: String(createdPictureId),
        });
        expect(endOutput.invites.length).toEqual(0);
    });

    afterAll(async () => {
        await deleteMultipleInvites(createdInviteIds);
        await deleteMultiplePictures(createdPictureIds);
    });
});
