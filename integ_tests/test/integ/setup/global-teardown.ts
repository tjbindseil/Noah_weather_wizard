import { testUser1, testUser2, testUser3, testUser4 } from './seedUsers';
import { deleteUser } from '../api_helpers/user_service_api';
import { DeleteUserInput } from 'ww-3-models-tjb';

const deleteTestUsers = async () => {
    const deletePromises: Promise<DeleteUserInput>[] = [];
    [testUser1, testUser2, testUser3, testUser4].forEach((u) => {
        if (!u.accessToken) {
            console.error(
                `user: ${JSON.stringify(
                    u
                )} does not have a token during teardown`
            );
            throw new Error();
        }
        deletePromises.push(deleteUser({ accessToken: u.accessToken }));
    });
    await Promise.all(deletePromises);
};

module.exports = async () => {
    console.log('start global teardown');
    await deleteTestUsers();
    console.log('end global teardown');
};
