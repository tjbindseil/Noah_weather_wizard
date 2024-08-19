// create forecast table sql:
// CREATE TABLE forecast (
//      "id" serial PRIMARY KEY,
//      "latitude" real NOT NULL,
//      "longitude" real NOT NULL,
//      "sun" bool NOT NULL
// );
//
// create polygon table sql:
// CREATE TABLE polygon (
//      "id" serial PRIMARY KEY,
//      "url" varchar (256) NOT NULL
// );
//
// create forecastHourly table sql:
// CREATE TABLE forecastHourly (
//      "id" serial PRIMARY KEY,
//      "polygonID" varchar (256) NOT NULL,
//      "sun" bool NOT NULL
// );
