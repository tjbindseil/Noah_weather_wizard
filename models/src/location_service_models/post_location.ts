import { Location } from './location';

export interface PostLocationInput {
    name: string;
    latitude: number;
    longitude: number;
}

export interface PostLocationOutput {
    location: Location;
}
