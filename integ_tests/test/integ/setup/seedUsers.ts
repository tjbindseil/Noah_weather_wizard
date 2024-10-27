import { User } from 'ww-3-models-tjb';

export interface UserWithTokens extends User {
    accessToken: string | undefined;
}

export const testUser1: UserWithTokens = {
    username: 'testUser1',
    password: 'Badpassword1&',
    email: 'unverified@example.com',
    accessToken: undefined,
};
export const testUser2: UserWithTokens = {
    username: 'testUser2',
    password: 'Badpassword2&',
    email: 'unverified@example.com',
    accessToken: undefined,
};
export const testUser3: UserWithTokens = {
    username: 'testUser3',
    password: 'Badpassword3&',
    email: 'unverified@example.com',
    accessToken: undefined,
};
export const testUser4: UserWithTokens = {
    username: 'testUser4',
    password: 'Badpassword4&',
    email: 'unverified@example.com',
    accessToken: undefined,
};
