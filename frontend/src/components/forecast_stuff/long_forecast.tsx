import { Forecast, Spot } from 'ww-3-models-tjb';
import { ForecastTable } from './forecast_table';

interface LongForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
}

export const LongForecast = ({ forecasts }: LongForecastProps) => {
  return (
    <ForecastTable
      forecasts={forecasts}
      periodFunc={(period, spot) => (
        <td key={`${spot.id} - ${period.name}`}>period.detailedForecast</td>
      )}
    />
  );
};
