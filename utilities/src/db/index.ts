import { Client } from 'ts-postgres';

export const makeTables = async (pgClient: Client) => {
    console.log('making spot table');
    await pgClient.query(
        'CREATE TABLE spot ( "id" serial PRIMARY KEY, "name" varchar (256) NOT NULL, "latitude" real NOT NULL, "longitude" real NOT NULL, "polygonId" varchar (16), "gridX" smallint NOT NULL, "gridY" smallint NOT NULL, "creator" varchar (128) NOT NULL)'
    );
    console.log('done making spot table');
    console.log('making favorite table');
    await pgClient.query(
        'CREATE TABLE favorite ( "id" serial PRIMARY KEY, "username" varchar (128) NOT NULL, "spotId" integer REFERENCES spot (id) ON DELETE CASCADE)'
    );
    console.log('done making favorite table');
};
