import { Client } from 'ts-postgres';
import { Invite, Picture } from 'dwf-3-models-tjb';

type PostedPicture = Omit<Picture, 'id'>;

export const insertPicture = async (
    pgClient: Client,
    picture: PostedPicture
) => {
    const result = pgClient.query<Picture>(
        'insert into picture("name", "createdBy", "bucketName", "key", "open") values ($1, $2, $3, $4, $5) returning *',
        [
            picture.name,
            picture.createdBy,
            picture.bucketName,
            picture.key,
            picture.open,
        ]
    );

    return await result.one();
};

export const getPictures = async (
    pgClient: Client,
    bucketName: string,
    requestor: string
) => {
    // currently, it gets open pics and pics the requestor created.
    // we need to add (closed) pics that the requestor has been invited to
    //
    // so, two ways (i think..)
    // 1. select a list of picture IDs from the invites table, add it to the below query like so
    // ... get list of ids, not sure how to do that yet ... then,
    // 'SELECT * FROM picture WHERE "bucketName"=$1 AND ("open"=true OR "createdBy"=$2 OR "id" in list_of_picture_ids_from_invite_table)'
    //
    // 'select * from picture where "bucketName"=$1 AND ("open"=true OR "createdBy"=$2 OR "id" in (select picture from invite where "invitee"=$2)'
    //
    // 2.
    // a) do a join such that every picture has information on who was invited (would require listing all users and checking the user lists)
    // b) do a join such that every invite has information on the picture, this still leaves us having to check open pictures as they don't have invites
    //
    // so i think i will go with 1
    //
    const result = pgClient.query<Picture>(
        'SELECT * FROM picture WHERE "bucketName"=$1 AND ("open"=true OR "createdBy"=$2 OR "id" in (SELECT picture FROM invite WHERE "invitee"=$2))',
        [bucketName, requestor]
    );

    const pictures: Picture[] = [];
    for await (const pic of result) {
        pictures.push(pic);
    }

    return pictures;
};

export const selectPicture = async (
    pgClient: Client,
    pictureId: number
): Promise<Picture> => {
    const result = pgClient.query<Picture>(
        'SELECT * FROM picture WHERE id = $1',
        [pictureId]
    );

    return await result.one();
};

export const pictureNameInUse = async (
    pgClient: Client,
    pictureName: string,
    createdBy: string
): Promise<boolean> => {
    const result = pgClient.query<Picture>(
        'SELECT * FROM picture WHERE "name" = $1 AND "createdBy" = $2',
        [pictureName, createdBy]
    );

    const rows = (await result).rows;
    if (rows.length > 0) {
        return true;
    } else {
        return false;
    }
};

export const deletePicture = async (pgClient: Client, pictureId: number) => {
    const result = pgClient.query<Picture>(
        'DELETE FROM picture WHERE id = $1 returning *',
        [pictureId]
    );

    return await result.one();
};

export const postInvite = async (
    pgClient: Client,
    pictureId: number,
    invitee: string,
    writeAccess: boolean
) => {
    const result = pgClient.query<Picture>(
        'insert into invite("picture", "invitee", "writeAccess") values ($1, $2, $3) returning *',
        [pictureId, invitee, writeAccess]
    );

    return await result.one();
};

export const getInvitesByPictureId = async (
    pgClient: Client,
    pictureId: number
) => {
    const result = pgClient.query<Invite>(
        'SELECT * FROM invite WHERE picture = $1',
        [pictureId]
    );

    const invites: Invite[] = [];
    for await (const invite of result) {
        invites.push(invite);
    }

    return invites;
};

export const getInvitesByInvitee = async (
    pgClient: Client,
    invitee: string
) => {
    const result = pgClient.query<Invite>(
        'SELECT * FROM invite WHERE invitee = $1',
        [invitee]
    );

    const invites: Invite[] = [];
    for await (const invite of result) {
        invites.push(invite);
    }

    return invites;
};

export const deleteInvite = async (
    pgClient: Client,
    pictureId: number,
    invitee: string
) => {
    await pgClient.query<Invite>(
        'DELETE FROM invite WHERE picture = $1 and invitee = $2',
        [pictureId, invitee]
    );
};
