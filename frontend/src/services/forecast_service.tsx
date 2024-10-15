import { _schema, GetForecastsInput, GetForecastsOutput } from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import Ajv from 'ajv';

export interface IForecastService {
  getForecasts(input: GetForecastsInput): Promise<GetForecastsOutput>;
}

export const ForecastServiceContext = Contextualizer.createContext(
  ProvidedServices.ForecastService,
);
export const useForecastService = (): IForecastService =>
  Contextualizer.use<IForecastService>(ProvidedServices.ForecastService);

// TODO check this out
// might want to use a similar pattern to the backend
// so service object that utilizes virtuality to delegate owning the validator to child objects, probably overkill tho

const ajv = new Ajv();

const ForecastService = ({ children }: any) => {
  const baseUrl = 'http://localhost:8081';
  const getForecastsOutputValidator = ajv.compile(_schema.GetForecastsOutput);

  const forecastService = {
    async getForecasts(input: GetForecastsInput): Promise<GetForecastsOutput> {
      const result = await (
        await fetch(`${baseUrl}/forecasts?` + new URLSearchParams({ ...input }), {
          method: 'GET',
          mode: 'cors',
        })
      ).json();

      if (!getForecastsOutputValidator(result)) {
        throw new Error(`invalid response: ${result}`);
      }

      return result as GetForecastsOutput;
    },
  };

  return (
    <>
      <ForecastServiceContext.Provider value={forecastService}>
        {children}
      </ForecastServiceContext.Provider>
    </>
  );
};

export default ForecastService;
