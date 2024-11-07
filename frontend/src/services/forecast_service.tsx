import { _schema, GetForecastsInput, GetForecastsOutput } from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { getWithError } from './fetch_wrapper';

export interface IForecastService {
  getForecasts(input: GetForecastsInput): Promise<GetForecastsOutput>;
}

export const ForecastServiceContext = Contextualizer.createContext(
  ProvidedServices.ForecastService,
);
export const useForecastService = (): IForecastService =>
  Contextualizer.use<IForecastService>(ProvidedServices.ForecastService);

const ForecastService = ({ children }: any) => {
  const baseUrl = 'http://localhost:8081';

  const forecastService = {
    async getForecasts(input: GetForecastsInput): Promise<GetForecastsOutput> {
      return await getWithError<GetForecastsOutput>(
        { ...input },
        `${baseUrl}/forecasts`,
        _schema.GetForecastsOutput,
      );
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
