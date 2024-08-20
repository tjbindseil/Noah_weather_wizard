export const getPolygonID = async (latitude: number, longitude: number) => {
    // first, take the lat/long and get some (polygon ID) from NOAA API
    const noaaURL = `https://api.weather.gov/points${latitude},${longitude}`;
    const fetchResult = (await (
        await fetch(noaaURL, {
            method: 'GET',
        })
    ).json()) as { forecast: { gridID: string } }; // TODO can I do this better?
    return fetchResult.forecast.gridID;
};
