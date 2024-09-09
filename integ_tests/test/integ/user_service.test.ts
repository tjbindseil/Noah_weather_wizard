import { UserWithToken } from './setup/seedUsers';
import { authUser, createUser, deleteUser } from './api_helpers';

describe('UserService integ tests', () => {
    const testUser: UserWithToken = {
        username: 'testuser',
        password: 'Badpassword11&',
        email: 'unverified@example.com',
        token: undefined,
    };

    it('creates a user', async () => {
        await createUser(testUser);
    });

    it('authorizes a user', async () => {
        await authUser(testUser);
    });

    it('deletes a user', async () => {
        await deleteUser(testUser);
    });

    // * refresh a token - will involve modifying the expiration or a long test, could be difficult
    // * confirm a user - will probably need a dedicated email for this, could be difficult
    //   * so, based off two minutes of research, it seems like the available solutions
    //   are products that listen on the email, and upon receiving a message, broadcast its
    //   contents so they can be verified
});
