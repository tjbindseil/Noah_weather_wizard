import { get_app_config } from 'dwf-3-app-config-tjb';
import { Client } from 'ts-postgres';
import {
    deleteInvite,
    deletePicture,
    getInvitesByInvitee,
    getInvitesByPictureId,
    getPictures,
    insertPicture,
    pictureNameInUse,
    postInvite,
    selectPicture,
} from '../../../src/db/dbo';
import { Invite, Picture } from 'dwf-3-models-tjb';

import { createPool } from 'generic-pool';

// these tests will actually interface with a pg database on my local machine
// see src/db/index.ts for a command to make the database

describe('dbo tests', () => {
    let client: Client;
    const pool = createPool(
        {
            create: async () => {
                const client = new Client(
                    get_app_config().pictureDbConnectionConfig
                );
                await client.connect();
                client.on('error', console.log);
                return client;
            },
            destroy: async (client: Client) => client.end(),
            validate: (client: Client) => {
                return Promise.resolve(!client.closed);
            },
        },
        {
            testOnBorrow: true,
            max: 1,
            min: 1,
        }
    );

    const testBucketName = 'test_bucket_name';
    const insertTestBucketName = `insert_${testBucketName}`;
    const notTestBucketName = `not_${testBucketName}`;
    const deleteBucketName = `delete_${testBucketName}`;

    const testUser1 = '1';
    const testUser2 = '2';
    const testUser3 = '3';
    const closedPictureTestUser = 'closedPictureTestUser';

    const makePicture = (
        name: string,
        createdBy: string,
        bucketName: string,
        open = true
    ) => ({
        id: -1, // TODO whats going on here?
        name,
        createdBy,
        bucketName,
        key: `${name}_by_${createdBy}`,
        open,
    });

    const initialPicture1 = makePicture(
        'initialPicture1',
        testUser1,
        testBucketName
    );
    const initialPicture2 = makePicture(
        'initialPicture2',
        testUser2,
        testBucketName
    );
    const initialPictureClosed = makePicture(
        'initialPictureClosed',
        closedPictureTestUser,
        testBucketName,
        false
    );

    beforeAll(async () => {
        client = await pool.acquire();
    });

    let pictureIdsToDelete: number[] = [];
    let inviteIdsToDelete: number[] = [];

    beforeEach(async () => {
        pictureIdsToDelete = [];
        inviteIdsToDelete = [];

        // picture seeds
        const initialPictureOpen = makePicture(
            'initialPictureOpen',
            closedPictureTestUser,
            testBucketName
        );
        const unexpectedPicture = makePicture(
            'unexpectedPicture',
            testUser2,
            notTestBucketName
        );

        const picturesToInsert = [
            initialPicture1,
            initialPicture2,
            initialPictureClosed,
            initialPictureOpen,
            unexpectedPicture,
        ];
        for (let i = 0; i < picturesToInsert.length; ++i) {
            const picture = picturesToInsert.at(i);
            if (picture) {
                const inserted = await insertPicture(client, picture);
                picture.id = inserted.id;
                pictureIdsToDelete.push(inserted.id);
            }
        }

        // invite seeds (these need to be created after the pictures
        const invite_for_testUser1_on_picture2 = {
            pictureId: initialPicture2.id,
            invitee: testUser1,
            writeAccess: true,
        };

        const invite_for_testUser3_on_picture2 = {
            pictureId: initialPicture2.id,
            invitee: testUser3,
            writeAccess: true,
        };
        const invite_for_testUser3_on_picture1 = {
            pictureId: initialPicture1.id,
            invitee: testUser3,
            writeAccess: true,
        };
        const invitesToInsert = [
            invite_for_testUser1_on_picture2,
            invite_for_testUser3_on_picture2,
            invite_for_testUser3_on_picture1,
        ];
        for (let i = 0; i < invitesToInsert.length; ++i) {
            const { pictureId, invitee, writeAccess } = invitesToInsert[i];
            const inserted = await postInvite(
                client,
                pictureId,
                invitee,
                writeAccess
            );
            inviteIdsToDelete.push(inserted.id);
        }
    });

    afterEach(async () => {
        // can't just drop all (truncate) because this is the same db that is used when running the app on the host
        for (let i = 0; i < inviteIdsToDelete.length; ++i) {
            await client.query<Invite>(
                'delete from invite where "id" in ($1)',
                [inviteIdsToDelete.at(i)]
            );
        }
        for (let i = 0; i < pictureIdsToDelete.length; ++i) {
            await client.query<Picture>(
                'delete from picture where "id" in ($1)',
                [pictureIdsToDelete.at(i)]
            );
        }
    });

    afterAll(async () => {
        await pool.release(client);
        pool.drain().then(() => pool.clear());
    });

    // this is hard to keep track of...
    // lets maybe do something more explicit
    //
    // like a factory for pictures before and after insertion
    // and then track everything and delete it all at the end

    it('gets open pictures when pictures are anonymously requested', async () => {
        const pictures = await getPictures(client, testBucketName, '');

        expect(pictures.length).toBe(3);
    });

    it('gets all pictures the requestor created, regardless of if they are open', async () => {
        const pictures = await getPictures(
            client,
            testBucketName,
            closedPictureTestUser
        );

        expect(pictures.length).toBe(4);
    });

    it('inserts a picture', async () => {
        const initialPictures = await getPictures(
            client,
            insertTestBucketName,
            ''
        );
        expect(initialPictures.length).toBe(0);

        const toInsertPicture = makePicture(
            'toInsertPicture',
            testUser2,
            insertTestBucketName
        );

        const inserted = await insertPicture(client, toInsertPicture);
        expect(inserted.id).toBeDefined();
        pictureIdsToDelete.push(inserted.id);

        const finalPictures = await getPictures(
            client,
            insertTestBucketName,
            ''
        );
        expect(finalPictures.length).toBe(1);
    });

    it('deletes a picture', async () => {
        const initialPictures = await getPictures(client, deleteBucketName, '');
        expect(initialPictures.length).toBe(0);

        const toDeletePicture = makePicture(
            'toDeletePicture',
            testUser3,
            deleteBucketName
        );
        const inserted = await insertPicture(client, toDeletePicture);
        // expect(inserted.id).toBeDefined();

        const intermediateDeletePictures = await getPictures(
            client,
            deleteBucketName,
            ''
        );
        expect(intermediateDeletePictures.length).toBe(1);

        await deletePicture(client, inserted.id);

        const finalDeletePictures = await getPictures(
            client,
            deleteBucketName,
            ''
        );
        expect(finalDeletePictures.length).toBe(0);
    });

    it('throws when deleting a picture that does not exist', async () => {
        // arbitrary random id, might break if that happens to be one of the above
        const expectedError = new Error('Query returned an empty result');
        await expect(deletePicture(client, 444444444)).rejects.toThrow(
            expectedError
        );
    });

    it('selects a picture given the pictureId', async () => {
        const initialPictures = await getPictures(client, testBucketName, '');
        expect(initialPictures.length).toBe(3);
        const expectedPicture = initialPictures[0];

        const actualPicture = await selectPicture(client, expectedPicture.id);

        expect(actualPicture).toEqual(expectedPicture);
    });

    it('says the picture is in use when the user and name are already in use', async () => {
        const picInUse = await pictureNameInUse(
            client,
            initialPicture1.name,
            initialPicture1.createdBy
        );
        expect(picInUse).toBeTruthy();
    });

    it('says the picture is not in use when either the user and name are not already in use together', async () => {
        const picInUse1 = await pictureNameInUse(
            client,
            initialPicture2.name,
            initialPicture1.createdBy
        );
        const picInUse2 = await pictureNameInUse(
            client,
            initialPicture1.name,
            initialPicture2.createdBy
        );
        expect(picInUse1).toBeFalsy();
        expect(picInUse2).toBeFalsy();
    });

    it('inserts into invite db', async () => {
        const inviteToInsert = {
            pictureId: initialPicture1.id,
            invitee: testUser2,
            writeAccess: true,
        };

        const inserted = await postInvite(
            client,
            inviteToInsert.pictureId,
            inviteToInsert.invitee,
            inviteToInsert.writeAccess
        );
        expect(inserted.id).toBeDefined();
        inviteIdsToDelete.push(inserted.id);

        const finalInvites = await getInvitesByInvitee(client, testUser2);
        expect(finalInvites.length).toBe(1);
    });

    it('gets invites by pictureId', async () => {
        const invites = await getInvitesByPictureId(client, initialPicture2.id);

        expect(invites.length).toEqual(2);
        invites.forEach((i) => expect(i.picture).toEqual(initialPicture2.id));
    });

    it('gets invites by invitee', async () => {
        const invites = await getInvitesByInvitee(client, testUser3);

        expect(invites.length).toEqual(2);
        invites.forEach((i) => expect(i.invitee).toEqual(testUser3));
    });

    it('deletes invites', async () => {
        const invites = await getInvitesByInvitee(client, testUser3);
        expect(invites.length).toEqual(2);

        await deleteInvite(client, initialPicture2.id, testUser3);

        const afterInvites = await getInvitesByInvitee(client, testUser3);
        expect(afterInvites.length).toEqual(1);
    });

    it('gets closed pictures the requestor is invited to', async () => {
        // closedPictureTestUser makes closed picture, so if closedPictureTestUser invites testUser2,
        // then when testUser2 gets the invite, they should see expectedPictureClosed
        const inviteToInsert = {
            pictureId: initialPictureClosed.id,
            invitee: testUser2,
            writeAccess: true,
        };

        const inserted = await postInvite(
            client,
            inviteToInsert.pictureId,
            inviteToInsert.invitee,
            inviteToInsert.writeAccess
        );
        expect(inserted.id).toBeDefined();
        inviteIdsToDelete.push(inserted.id);

        const pictures = await getPictures(client, testBucketName, testUser2);
        const pictureIds = pictures.map((p) => p.id);

        expect(pictureIds.includes(initialPictureClosed.id)).toBeTruthy();
    });
});
