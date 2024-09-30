import { Spot } from './spot';

export interface GetSpotsInput {
    minLat: string;
    maxLat: string;
    minLong: string;
    maxLong: string;
}

export interface GetSpotsOutput {
    spots: Spot[];
}
