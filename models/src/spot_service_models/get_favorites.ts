import { Spot } from './spot';

export interface GetFavoritesInput {}

export interface GetFavoritesOutput {
    favoriteSpots: Spot[];
}
