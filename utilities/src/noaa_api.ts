// TODO handle 5 second wait and retry when issues arise

export const makeInitialCall = async (latitude: number, longitude: number) => {
    console.log(
        `@@ @@ makeInitialCall, lat: ${latitude} and long: ${longitude}`
    );
    const noaaURL = `https://api.weather.gov/points/${latitude},${longitude}`;
    const raw = await (
        await fetch(noaaURL, {
            method: 'GET',
        })
    ).json();
    console.log(
        `@@ @@ makeInitialCall and raw is: ${JSON.stringify(raw, null, 2)}`
    );
    const fetchResult = raw as {
        properties: { gridId: string; forecast: string };
    };
    //     const fetchResult = (await (
    //         await fetch(noaaURL, {
    //             method: 'GET',
    //         })
    //     ).json()) as { properties: { gridId: string; forecast: string } }; // TODO can I do this better?

    console.log(
        `@@ @@ makeInitialCall returning gridID: ${fetchResult.properties.gridId}`
    );
    return [fetchResult.properties.gridId, fetchResult.properties.forecast];
};

export const getForecast = async (forecastUrl: string) => {
    console.log(`@@ @@ getForecast and forecastUrl is: ${forecastUrl}`);
    //     const fetchResult = (await (
    //         await fetch(forecastUrl, {
    //             method: 'GET',
    //         })
    //     )
    //         /* eslint-disable  @typescript-eslint/no-explicit-any */
    //         .json()) as { properties: any; geometry: any };

    const raw = await (
        await fetch(forecastUrl, {
            method: 'GET',
        })
    ).json();

    console.log(`@@ @@ getForecast and raw is ${JSON.stringify(raw, null, 2)}`);

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const fetchResult = raw as { properties: any; geometry: any };

    return [fetchResult.properties, fetchResult.geometry];
};
