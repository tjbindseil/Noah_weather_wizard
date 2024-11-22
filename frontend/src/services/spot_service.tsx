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
} from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { useUserService } from './user_service';
import { fetchWithError, getWithError, HTTPMethod } from './fetch_wrapper';
import { baseUrl } from '.';

export interface ISpotService {
  createSpot(input: PostSpotInput): Promise<PostSpotOutput>;
  getSpots(input: GetSpotsInput): Promise<GetSpotsOutput>;
  deleteSpot(input: DeleteSpotInput): Promise<DeleteSpotOutput>;
  getFavorites(input: GetFavoritesInput): Promise<GetFavoritesOutput>;
  postFavorite(input: PostFavoriteInput): Promise<PostFavoriteOutput>;
  deleteFavorite(input: DeleteFavoriteInput): Promise<DeleteFavoriteOutput>;
}

// so,
// app loads
// we check to load the selected spots
// if spots are selected, bounds are ensured to show these spots
// this interacts with the lat/lng that are stored
// in theory, the only way we could have spots that are not in scope, is if we allow them to remain selected after the map zooms them off the map
// so, what happens today when we move the window after selecting some?
// ...
// they remain selected!
//
// lets keep it simple
// spots can only be selected if they are in view
//
// hmm, a lot of the things im thinking about revovle around the fact that the map bounds are hard to deal with
// is there a way to broadcast them to the entire system?
//
// as of now, there is a way to get them (from the mapService), but there is not way to know when they've changed?
//
// lets try it from firt principles
//
// well, the way it would work is for all components to register their setMapBounds state funcs with the map service
// then, when the mapService.setCenter or map.setZoom is called, all registered setMapBounds funcs are called
//
// so, the event registration and broadcast change is quite the overhaul. Lets keep to what we have and just get
// the selected spots to be saved

export const SpotServiceContext = Contextualizer.createContext(ProvidedServices.SpotService);
export const useSpotService = (): ISpotService =>
  Contextualizer.use<ISpotService>(ProvidedServices.SpotService);

// TODO incorporate eslint and prettier in build process for frontend like backend
/* eslint-disable  @typescript-eslint/no-explicit-any */
const SpotService = ({ children }: any) => {
  const userService = useUserService();

  const spotService = {
    async createSpot(postSpotInput: PostSpotInput): Promise<PostSpotOutput> {
      return await fetchWithError<PostSpotInput, PostSpotOutput>(
        postSpotInput,
        `${baseUrl}/spot`,
        HTTPMethod.POST,
        _schema.PostSpotOutput,
        userService,
      );
    },

    async getSpots(input: GetSpotsInput): Promise<GetSpotsOutput> {
      return await getWithError({ ...input }, `${baseUrl}/spots`, _schema.GetSpotsOutput);
    },

    async deleteSpot(input: DeleteSpotInput): Promise<DeleteSpotOutput> {
      return await fetchWithError<DeleteSpotInput, DeleteSpotOutput>(
        input,
        `${baseUrl}/spot`,
        HTTPMethod.DELETE,
        _schema.DeleteSpotOutput,
        userService,
      );
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
  };

  return (
    <>
      <SpotServiceContext.Provider value={spotService}>{children}</SpotServiceContext.Provider>
    </>
  );
};

export default SpotService;
