import { Forecast, Spot } from 'ww-3-models-tjb';
import { ForecastTable } from './forecast_table';

interface ShortForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
}

export const ShortForecast = ({ forecasts }: ShortForecastProps) => {
  return (
    <ForecastTable
      forecasts={forecasts}
      periodFunc={(period, spot) => (
        <td key={`${spot.id} - ${period.name}`}>{period.shortForecast}</td>
      )}
    />
  );
};
