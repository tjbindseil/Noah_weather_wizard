import { Forecast, Spot } from 'ww-3-models-tjb';

interface ImageForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
}

// TODO spot names and column headers remain sticky while scrolling
// width is too much, should only be 100%
export const ImageForecast = ({ forecasts }: ImageForecastProps) => {
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
              <td key={`${spot.id} - ${period.name}`}>
                <img src={period.icon} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
