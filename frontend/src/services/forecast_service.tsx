import {
  _schema,
  GetForecastsInput,
  GetForecastsOutput,
  GetForecastsHourlyOutput,
  GetForecastsHourlyInput,
} from 'ww-3-models-tjb';
import Contextualizer from './contextualizer';
import ProvidedServices from './provided_services';
import { getWithError } from './fetch_wrapper';
import { baseUrl } from '.';

export interface IForecastService {
  getForecasts(input: GetForecastsInput): Promise<GetForecastsOutput>;
  getForecastsHourly(input: GetForecastsHourlyInput): Promise<GetForecastsHourlyOutput>;
}

export const ForecastServiceContext = Contextualizer.createContext(
  ProvidedServices.ForecastService,
);
export const useForecastService = (): IForecastService =>
  Contextualizer.use<IForecastService>(ProvidedServices.ForecastService);

// TODO could this actually have a type?
/* eslint-disable  @typescript-eslint/no-explicit-any */
const ForecastService = ({ children }: any) => {
  const forecastService = {
    async getForecasts(input: GetForecastsInput): Promise<GetForecastsOutput> {
      return await getWithError<GetForecastsOutput>(
        { ...input },
        `${baseUrl}/forecasts`,
        _schema.GetForecastsOutput,
      );
    },

    async getForecastsHourly(input: GetForecastsInput): Promise<GetForecastsHourlyOutput> {
      return await getWithError<GetForecastsHourlyOutput>(
        { ...input },
        `${baseUrl}/forecasts_hourly`,
        _schema.GetForecastsHourlyOutput,
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
