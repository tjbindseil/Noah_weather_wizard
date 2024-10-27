import { get_app_config } from 'ww-3-app-config-tjb';
import {
    DeleteUserInput,
    PostAuthInput,
    PostAuthOutput,
    PostConfirmationInput,
    PostConfirmationOutput,
    PostRefreshInput,
    PostRefreshOutput,
    PostUserInput,
    PostUserOutput,
} from 'ww-3-models-tjb';
import { fetchWithError } from './fetch_with_error';

const userServiceBaseUrl = `http://${get_app_config().userServiceHost}:${
    get_app_config().userServicePort
}`;

export const postUser = async (input: PostUserInput) => {
    return await fetchWithError<PostUserOutput>(
        'posting user',
        `${userServiceBaseUrl}/user`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );
};

export const postAuth = async (input: PostAuthInput) => {
    return await fetchWithError<PostAuthOutput>(
        'posting Auth',
        `${userServiceBaseUrl}/auth`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );
};

export const postConfirmation = async (input: PostConfirmationInput) => {
    return await fetchWithError<PostConfirmationOutput>(
        'posting Confirmation',
        `${userServiceBaseUrl}/confirmation`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );
};

export const postRefresh = async (input: PostRefreshInput) => {
    return await fetchWithError<PostRefreshOutput>(
        'posting Refresh',
        `${userServiceBaseUrl}/refresh`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );
};

export const deleteUser = async (input: DeleteUserInput) => {
    return await fetchWithError<DeleteUserInput>(
        'deleting user',
        `${userServiceBaseUrl}/user`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );
};
