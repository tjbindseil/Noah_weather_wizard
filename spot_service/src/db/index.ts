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
//      "
// );
//
//   // ... hmmm, forecast and polygon are 1:1
//   // are they the same thing?
//
//
// lets do the options thing again:
// 1. forecast as a separate table from polygon
// 2. forecast and polygon are the same table
//
//
// well honestly, this is making me realize this is more the creation and of everything, then
//
// would it be a good time to use a document db?
//
// s3 bucket? I mean at some point, its easy to just have alphabetical sub buckets (directories) each directory has an object
//
// bucket: ww-dev-forecasts
// key: /ABC/forecast.json or /ABC/forecastHourly.json or /ABC/shape.json
//
//
// hmmm, how will this effect perfomance when fetching?
// well, without radius, its a hashmap
// so we need some way to potentially speed up the fetching of the lat long in a radius
// like, how do we show the locatinos on the map
// well, this index woudl actually be on the spot RDS table
// so i think that still works
//
// so, onward
