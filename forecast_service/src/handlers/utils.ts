import { Client } from 'ts-postgres';
import { Spot } from 'ww-3-models-tjb';
import { getSpot, ForecastKey } from 'ww-3-utilities-tjb';

export const getSpotToForecastKeyMap = async (
    pgClient: Client,
    spotIdsStr: string
) => {
    const spotIds: number[] = spotIdsStr
        .split(',')
        .map((str) => parseFloat(str));

    const spotPromises: Promise<Spot>[] = [];
    for (let i = 0; i < spotIds.length; ++i) {
        spotPromises.push(getSpot(pgClient, spotIds[i]));
    }
    const spotToForecastKeyMap = new Map<Spot, ForecastKey>();
    (await Promise.all(spotPromises)).forEach((spot) =>
        spotToForecastKeyMap.set(
            spot,
            new ForecastKey(spot.polygonID, spot.gridX, spot.gridY)
        )
    );
    return spotToForecastKeyMap;
};
