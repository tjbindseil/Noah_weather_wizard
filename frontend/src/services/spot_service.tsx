import {
  _schema,
  GetSpotsInput,
  GetSpotsOutput,
  PostSpotInput,
  PostSpotOutput,
} from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import Ajv from 'ajv';
import { useUserService } from './user_service';

export interface ISpotService {
  createSpot(input: PostSpotInput): Promise<PostSpotOutput>;
  getSpots(input: GetSpotsInput): Promise<GetSpotsOutput>;
}

export const SpotServiceContext = Contextualizer.createContext(ProvidedServices.SpotService);
export const useSpotService = (): ISpotService =>
  Contextualizer.use<ISpotService>(ProvidedServices.SpotService);

// TODO check this out
// might want to use a similar pattern to the backend
// so service object that utilizes virtuality to delegate owning the validator to child objects, probably overkill tho

const ajv = new Ajv();

// TODO incorporate eslint and prettier in build process for frontend like backend
/* eslint-disable  @typescript-eslint/no-explicit-any */
const SpotService = ({ children }: any) => {
  const userService = useUserService();

  const baseUrl = 'http://localhost:8080';
  const postSpotOutputValidator = ajv.compile(_schema.PostSpotOutput);
  const getSpotsOutputValidator = ajv.compile(_schema.GetSpotsOutput);

  const spotService = {
    async createSpot(postSpotInput: PostSpotInput): Promise<PostSpotOutput> {
      // TODO
      // pass in route, method, contenttype as optional with default as json, i/o types,
      // then have a map of output type to validator
      const result = await (
        await fetch(`${baseUrl}/spot`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer: ${userService.getAccessToken()}`,
          },
          body: JSON.stringify({
            ...postSpotInput,
          }),
        })
      ).json();

      if (!postSpotOutputValidator(result)) {
        throw new Error(`SpotService::createSpot - invalid response: ${JSON.stringify(result)}`);
      }

      return result as unknown as PostSpotOutput;
    },

    async getSpots(input: GetSpotsInput): Promise<GetSpotsOutput> {
      const result = await (
        await fetch(`${baseUrl}/spots?` + new URLSearchParams({ ...input }), {
          method: 'GET',
          mode: 'cors',
        })
      ).json();

      if (!getSpotsOutputValidator(result)) {
        throw new Error(`invalid response: ${result}`);
      }

      return result as GetSpotsOutput;
    },
  };

  return (
    <>
      <SpotServiceContext.Provider value={spotService}>{children}</SpotServiceContext.Provider>
    </>
  );
};

export default SpotService;
