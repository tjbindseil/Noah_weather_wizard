import { Forecast, Spot } from 'ww-3-models-tjb';
import { ForecastTable } from './forecast_table';

interface ImageForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
}

export const ImageForecast = ({ forecasts }: ImageForecastProps) => {
  return (
    <ForecastTable
      forecasts={forecasts}
      periodFunc={(period, spot) => (
        <td key={`${spot.id} - ${period.name}`}>
          <img src={period.icon} />
        </td>
      )}
    />
  );
};
