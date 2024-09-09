import { get_app_config } from 'dwf-3-app-config-tjb';
import { MongoClient } from 'mongodb';

export type MongoClientFactory = () => Promise<MongoClient>;

// TODO close on app close
let connectedMongoClient: MongoClient;
export const mongoClientFactory = async () => {
    if (!connectedMongoClient) {
        connectedMongoClient = new MongoClient(
            `mongodb://${
                get_app_config().updateToolSettingsDbConnectionConfig.host
            }:${get_app_config().updateToolSettingsDbConnectionConfig.port}`
        );
        await connectedMongoClient.connect();
    }

    return connectedMongoClient;
};
