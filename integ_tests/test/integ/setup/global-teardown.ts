import { get_app_config } from 'dwf-3-app-config-tjb';
import { mongoClientFactory } from './mongo_factory';
import { testUser1, testUser2, testUser3 } from './seedUsers';
import { deleteUser } from '../api_helpers/user_api';

const dropDatabase = async () => {
    const mongoClient = await mongoClientFactory();

    await mongoClient
        .db(get_app_config().updateToolSettingsDbConnectionConfig.db)
        .dropDatabase();

    await mongoClient.close();
};

const deleteTestUser = async () => {
    const deletePromises: Promise<void>[] = [];
    [testUser1, testUser2, testUser3].forEach((u) =>
        deletePromises.push(deleteUser(u))
    );
    await Promise.all(deletePromises);
};

module.exports = async () => {
    console.log('start global teardown');
    await dropDatabase();
    await deleteTestUser();
    console.log('end global teardown');
};
