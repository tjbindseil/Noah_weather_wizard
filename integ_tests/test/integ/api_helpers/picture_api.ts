import {
    PostPictureOutput,
    GetPicturesOutput,
    PostPictureInput,
    PostInviteInput,
    DeletePictureOutput,
    DeleteInviteInput,
    PostInviteOutput,
    GetInvitesInput,
    GetInvitesOutput,
    DeleteInviteOutput,
} from 'dwf-3-models-tjb';
import { UserWithToken } from '../setup/seedUsers';
import { get_app_config } from 'dwf-3-app-config-tjb';
import { fetchWithError } from './fetch_with_error';

const pictureServiceBaseUrl = `http://${get_app_config().pictureServiceHost}:${
    get_app_config().pictureServicePort
}`;

export const makePostPictureInput = (
    creator: string,
    name: string,
    params: Partial<PostPictureInput>
) => ({
    createdBy: creator,
    name: name,
    width: params.width ?? 40,
    height: params.height ?? 40,
    open: params.open ?? false,
});

export const createPicture = async (
    creator: UserWithToken,
    name: string,
    createdPictureIds: Map<number, UserWithToken>,
    postPictureInput?: PostPictureInput
): Promise<PostPictureOutput> => {
    if (!postPictureInput) {
        postPictureInput = makePostPictureInput(creator.username, name, {});
    }

    const output = await fetchWithError<PostPictureOutput>(
        'creating picture',
        `${pictureServiceBaseUrl}/picture`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${creator.token}`,
            },
            body: JSON.stringify(postPictureInput),
        }
    );

    createdPictureIds.set(output.picture.id, creator);

    return output;
};

export const listPictures = async (requestor: UserWithToken) => {
    const output = await fetchWithError<GetPicturesOutput>(
        'listing pictures',
        `${pictureServiceBaseUrl}/pictures`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${requestor.token}`,
            },
        }
    );
    return output;
};

export const deletePicture = async (
    deletor: UserWithToken,
    pictureId: number
) => {
    return await fetchWithError<DeletePictureOutput>(
        'deleting picture',
        `${pictureServiceBaseUrl}/picture`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${deletor.token}`,
            },
            body: JSON.stringify({ pictureId }),
        }
    );
};

export const deleteMultiplePictures = async (
    createdPictureIds: Map<number, UserWithToken>
) => {
    const deletePromises: Promise<DeletePictureOutput>[] = [];
    createdPictureIds.forEach((user, pictureId) => {
        deletePromises.push(deletePicture(user, pictureId));
    });

    for (const deletePromise of deletePromises) {
        await deletePromise;
    }
};

export const sendInvite = async (
    requestor: UserWithToken,
    postInviteInput: PostInviteInput,
    createdInviteIds: Map<DeleteInviteInput, UserWithToken>
) => {
    const output = await fetchWithError<PostInviteOutput>(
        'sending invite',
        `${pictureServiceBaseUrl}/invite`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${requestor.token}`,
            },
            body: JSON.stringify(postInviteInput),
        }
    );

    createdInviteIds.set(postInviteInput, requestor);

    return output;
};

export const getInvites = async (
    requestor: UserWithToken,
    getInvitesInput: GetInvitesInput
) => {
    const output = await fetchWithError<GetInvitesOutput>(
        'getting invitese',
        `${pictureServiceBaseUrl}/invites?` +
            new URLSearchParams({ ...getInvitesInput }),
        {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${requestor.token}`,
            },
        }
    );
    return output;
};

export const deleteInvite = async (
    deletor: UserWithToken,
    deleteInviteInput: DeleteInviteInput
) => {
    const output = await fetchWithError<DeleteInviteOutput>(
        'deleting invite',
        `${pictureServiceBaseUrl}/invite`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer: ${deletor.token}`,
            },
            body: JSON.stringify(deleteInviteInput),
        }
    );
    return output;
};

export const deleteMultipleInvites = async (
    createdInviteIds: Map<DeleteInviteInput, UserWithToken>
) => {
    const deletePromises: Promise<DeleteInviteOutput>[] = [];
    createdInviteIds.forEach((user, deleteInviteInput) => {
        deletePromises.push(deleteInvite(user, deleteInviteInput));
    });

    for (const deletePromise of deletePromises) {
        await deletePromise;
    }
};
