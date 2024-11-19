import { Forecast, Spot } from 'ww-3-models-tjb';

interface LongForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
}

export const LongForecast = ({ forecasts }: LongForecastProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Spot Name</th>
          {forecasts[0].forecast.periods.map((period) => (
            <th key={period.name}>{period.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {forecasts.map(({ forecast, spot }) => (
          <tr key={spot.name}>
            <td>{spot.name}</td>
            {forecast.periods.map((period) => (
              <td key={`${spot.id} - ${period.name}`}>{period.detailedForecast}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
