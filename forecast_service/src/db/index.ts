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
//      "lat
//
// create forecastHourly table sql:
// CREATE TABLE forecastHourly (
//      "id" serial PRIMARY KEY,
//      "polygonID" varchar (256) NOT NULL,
//      "sun" bool NOT NULL
// );
//
// hmmm,
// should forecast point to a location? ie use a location.id as a foreign key instead of duplicating the lat/long
//
// well, on one hand, it would be powerful if locations weren't duplicated, but it would also be restrictive
//
// powerful because ....
// restrictive because:
// * locations couldn't be private. If private, two individuals could have the same point without knowing about the others,
// and they would collide.
//
// well, thinking a bit more, it doesn't even make sense to link location to a forecast
// there is an intermediate step. location leads to polygon, and polygon leads to forecast
//
// so, maybe we need to maintain a location to polygon map
//
// ??? does the polygon remain constant?
//
// so, what does the process for fetching / caching the forecasts look like?
//
// chron job -> every 4 hours (12 am, 4 am, 8 am, 12 pm, 4 pm, 8 pm)
// for each point in locations, wait no, not locations, but polygons
//
// how do we know what all the locations are?
//
// I think this is the interesting part
//
// so, for each location, we want to find the ,,,,
// more elegantly, we need to reduce the locations to their polygons
//
//
// @@ ASSUMES THAT polygon shapes and IDs are consistent @@
// so, a location is a lat/long, and we need to determine
// if it fits in any of the existing polygons, if so, move on
// if it doesn't fit, fetch its polygon and add it to the list of polygons
//
// so, that begs the question of how to determine if a lat/long fits in a polygon
// options:
// 1. each polygon has a list of lat/long points associated with it, just remember after fetching
// probably better is to just have the polygon ID as part of the location model
//
// 2. search the polygons and determine if the current location fits in any of them
// I think we could reaosnably assume that lat/long are interchangable in this case (maybe we have to figure out which is ideal but still)
// so something like, sort (index) the polygons on their furthest notrth lat, then we can find all where the current point is valid,
// then end lats, then start long, then end long
//
// but... that's pretty hard, and it would be way easier to just track and remember the polygonID as its first discovered.
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
