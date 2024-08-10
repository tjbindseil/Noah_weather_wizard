// create picture table sql:
// CREATE TABLE picture (
//      "id" serial PRIMARY KEY,
//      "name" varchar (256) NOT NULL,
//      "createdBy" varchar (256) NOT NULL,
//      "bucketName" varchar (256) NOT NULL,
//      "key" varchar (256) NOT NULL
//      "open" boolean
// );
//
//
// CREATE TABLE invite (
//      "id" serial PRIMARY KEY,
//      "picture" integer REFERENCES picture (id) NOT NULL,
//      "invitee" text,
//      "writeAccess" boolean NOT NULL
// );
