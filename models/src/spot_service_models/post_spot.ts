import { Spot } from './spot';

export interface PostSpotInput {
    name: string;
    latitude: number;
    longitude: number;
}

export interface PostSpotOutput {
    spot: Spot;
}
