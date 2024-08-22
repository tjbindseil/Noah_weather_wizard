export const makeInitialCall = async (latitude: number, longitude: number) => {
    const noaaURL = `https://api.weather.gov/points/${latitude},${longitude}`;
    const fetchResult = (await (
        await fetch(noaaURL, {
            method: 'GET',
        })
    ).json()) as { properties: { gridId: string; forecast: string } }; // TODO can I do this better?

    return [fetchResult.properties.gridId, fetchResult.properties.forecast];
};

export const getForecast = async (forecastUrl: string) => {
    const fetchResult = (await (
        await fetch(forecastUrl, {
            method: 'GET',
        })
    ).json()) as { properties: any; geometry: any };

    return [fetchResult.properties, fetchResult.geometry];
};
