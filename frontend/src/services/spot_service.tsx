import {
  _schema,
  GetSpotsInput,
  GetSpotsOutput,
  PostSpotInput,
  PostSpotOutput,
  DeleteSpotInput,
  DeleteSpotOutput,
  PostFavoriteInput,
  PostFavoriteOutput,
  DeleteFavoriteInput,
  DeleteFavoriteOutput,
  GetFavoritesInput,
  GetFavoritesOutput,
  Spot,
} from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { useUserService } from './user_service';
import { fetchWithError, getWithError, HTTPMethod } from './fetch_wrapper';
import { baseUrl } from '.';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useEffect } from 'react';
import { LatLng, LatLngBounds } from 'leaflet';
import { refreshVisibleSpots } from '../app/visible_spots_reducer';
import { setMapBounds } from '../app/map_view_reducer';

export interface ISpotService {
  createSpot(input: PostSpotInput): Promise<PostSpotOutput>;
  getSpots(input: GetSpotsInput): Promise<GetSpotsOutput>;
  deleteSpot(input: DeleteSpotInput): Promise<DeleteSpotOutput>;
  getFavorites(input: GetFavoritesInput): Promise<GetFavoritesOutput>;
  postFavorite(input: PostFavoriteInput): Promise<PostFavoriteOutput>;
  deleteFavorite(input: DeleteFavoriteInput): Promise<DeleteFavoriteOutput>;
}

export const SpotServiceContext = Contextualizer.createContext(ProvidedServices.SpotService);
export const useSpotService = (): ISpotService =>
  Contextualizer.use<ISpotService>(ProvidedServices.SpotService);

// TODO incorporate eslint and prettier in build process for frontend like backend
/* eslint-disable  @typescript-eslint/no-explicit-any */
const SpotService = ({ children }: any) => {
  const userService = useUserService();

  const dispatch = useAppDispatch();
  const mapBounds = useAppSelector((state) => state.mapView.mapBounds);

  const spotService = {
    checkedSpots: [] as number[],
    existingSpots: [] as Spot[],

    async createSpot(postSpotInput: PostSpotInput): Promise<PostSpotOutput> {
      const output = await fetchWithError<PostSpotInput, PostSpotOutput>(
        postSpotInput,
        `${baseUrl}/spot`,
        HTTPMethod.POST,
        _schema.PostSpotOutput,
        userService,
      );
      this.refreshExistingSpots();
      return output;
    },

    async getSpots(input: GetSpotsInput): Promise<GetSpotsOutput> {
      return await getWithError({ ...input }, `${baseUrl}/spots`, _schema.GetSpotsOutput);
    },

    async deleteSpot(input: DeleteSpotInput): Promise<DeleteSpotOutput> {
      const output = await fetchWithError<DeleteSpotInput, DeleteSpotOutput>(
        input,
        `${baseUrl}/spot`,
        HTTPMethod.DELETE,
        _schema.DeleteSpotOutput,
        userService,
      );
      this.refreshExistingSpots();
      return output;
    },

    async getFavorites(input: GetFavoritesInput): Promise<GetFavoritesOutput> {
      return await getWithError(
        { ...input },
        `${baseUrl}/favorites`,
        _schema.GetFavoritesOutput,
        userService,
      );
    },

    async postFavorite(input: PostFavoriteInput): Promise<PostFavoriteOutput> {
      return await fetchWithError<PostFavoriteInput, PostFavoriteOutput>(
        input,
        `${baseUrl}/favorite`,
        HTTPMethod.POST,
        _schema.PostFavoriteOutput,
        userService,
      );
    },

    async deleteFavorite(input: DeleteFavoriteInput): Promise<DeleteFavoriteOutput> {
      return await fetchWithError<DeleteFavoriteInput, DeleteFavoriteOutput>(
        input,
        `${baseUrl}/favorite`,
        HTTPMethod.DELETE,
        _schema.DeleteSpotOutput,
        userService,
      );
    },

    refreshExistingSpots(): void {
      dispatch(setMapBounds(mapBounds));
    },
  };

  useEffect(() => {
    const mapBoundsCreated = new LatLngBounds(mapBounds.sw, mapBounds.ne);
    if (mapBoundsCreated.equals(new LatLngBounds(new LatLng(0, 0), new LatLng(0, 0)))) {
      // upon start up, we get a 0,0,0,0 map bounds before getting the map bounds, but the real map bounds
      // update that comes after get "covered up" by it, so this hack skips 0000 map bounds
      return;
    }

    spotService
      .getSpots({
        minLat: mapBoundsCreated.getSouth().toString(),
        maxLat: mapBoundsCreated.getNorth().toString(),
        minLong: mapBoundsCreated.getWest().toString(),
        maxLong: mapBoundsCreated.getEast().toString(),
      })
      .then((result) => {
        dispatch(
          refreshVisibleSpots(
            result.spots.map((spot) => ({
              spot,
              selected: false,
              favorite: false,
            })),
          ),
        );
      })
      .catch(console.error);
  }, [mapBounds]);

  return (
    <>
      <SpotServiceContext.Provider value={spotService}>{children}</SpotServiceContext.Provider>
    </>
  );
};

export default SpotService;
