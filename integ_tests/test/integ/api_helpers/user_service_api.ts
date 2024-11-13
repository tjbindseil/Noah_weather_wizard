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
import { baseUrl } from '.';

export const postUser = async (input: PostUserInput) => {
    return await fetchWithError<PostUserOutput>(
        'posting user',
        `${baseUrl}/user`,
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
        `${baseUrl}/auth`,
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
        `${baseUrl}/confirmation`,
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
        `${baseUrl}/refresh`,
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
        `${baseUrl}/user`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }
    );
};
