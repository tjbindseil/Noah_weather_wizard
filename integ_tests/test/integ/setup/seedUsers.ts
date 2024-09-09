import { User } from 'dwf-3-models-tjb';

export interface UserWithToken extends User {
    token: string | undefined;
}

export const testUser1: UserWithToken = {
    username: 'testUser1',
    password: 'Badpassword1&',
    email: 'unverified@example.com',
    token: undefined,
};
export const testUser2: UserWithToken = {
    username: 'testUser2',
    password: 'Badpassword2&',
    email: 'unverified@example.com',
    token: undefined,
};
export const testUser3: UserWithToken = {
    username: 'testUser3',
    password: 'Badpassword3&',
    email: 'unverified@example.com',
    token: undefined,
};
