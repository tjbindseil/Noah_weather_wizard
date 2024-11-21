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
