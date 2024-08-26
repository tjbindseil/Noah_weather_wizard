// create spot table sql:
// CREATE TABLE spot (
//      "id" serial PRIMARY KEY,
//      "name" varchar (256) NOT NULL,
//      "latitude" real NOT NULL,
//      "longitude" real NOT NULL
//      "polygonId" varchar (16) references polygon (id)
// );
//
// create polygon table sql:
// CREATE TABLE polygon (
//      "id" varchar (16) PRIMARY KEY,
//      "forecastURL" varchar 256 NOT NULL
// );
