import { get_app_config } from 'dwf-3-app-config-tjb';
import {
    DeleteUserInput,
    PostAuthInput,
    PostAuthOutput,
    PostUserInput,
} from 'dwf-3-models-tjb';
import { UserWithToken } from '../setup/seedUsers';
import { fetchWithError } from './fetch_with_error';

const userServiceBaseUrl = `http://${get_app_config().userServiceHost}:${
    get_app_config().userServicePort
}`;

export const createUser = async (user: UserWithToken) => {
    const postUserInput: PostUserInput = {
        user: user,
        testUser: true,
    };

    await fetchWithError('creating user', `${userServiceBaseUrl}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postUserInput),
    });
};

export const authUser = async (user: UserWithToken) => {
    const postAuthInput: PostAuthInput = {
        username: user.username,
        password: user.password,
    };
    const output = await fetchWithError<PostAuthOutput>(
        'authorizing user',
        `${userServiceBaseUrl}/auth`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postAuthInput),
        }
    );

    user.token = output.token.AccessToken;
};

export const deleteUser = async (user: UserWithToken) => {
    const deleteUserInput: DeleteUserInput = {
        username: user.username,
    };
    await fetchWithError('deleting user', `${userServiceBaseUrl}/user`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer: ${user.token}`,
        },
        body: JSON.stringify(deleteUserInput),
    });
};
