import inputData from './input.json';
import { makeRequest } from './makeRequest';
import { ForecastLocation } from './models/location';

const world = 'world';

export function hello(who: string = world): string {
    console.log('HERE');
    return `Hello ${who}! `;
}

hello(world);

const baseUrl = 'https://api.weather.gov/points/';
const locationMetadataMap = new Map();

const makeLocationForcast = async (location: {
    name: string;
    lat: number;
    long: number;
}) => {
    const { name, lat, long } = location;
    const url = `${baseUrl}${lat},${long}`;
    const rawMetedata = await makeRequest(url);
    locationMetadataMap.set(
        name,
        new ForecastLocation(
            name,
            lat,
            long,
            rawMetedata.forecastUrl,
            rawMetedata.forecastHourlyUrl
        )
    );
};

const locationPromises: Promise<void>[] = [];
inputData.locations.forEach(async (location: any) => {
    locationPromises.push(makeLocationForcast(location));
});

await Promise.all(locationPromises);

// so, now i have all the data i need
// it would be quick n dirty to make the tables,
// but probably better to take a step back and think more long term
