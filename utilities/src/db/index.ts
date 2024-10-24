// create spot table sql:
// CREATE TABLE spot (
//      "id" serial PRIMARY KEY,
//      "name" varchar (256) NOT NULL,
//      "latitude" real NOT NULL,
//      "longitude" real NOT NULL
//      "polygonId" varchar (16) references polygon (id),
//      "gridX" smallint NOT NULL,
//      "gridY" smallint NOT NULL,
//      "creator" varchar (128) NOT NULL
// );
//
// create favorite table sql:
// CREATE TABLE favorite (
//     "id" serial PRIMARY KEY,
//     "username" varchar (128) NOT NULL,
//     "spotId" integer REFERENCES spot (id)
// );
