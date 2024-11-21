import { Forecast, Spot } from 'ww-3-models-tjb';

interface ImageForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
}

// TODO this works! (only table moves)
// lets package it up and use it in the other forecasts
export const ImageForecast = ({ forecasts }: ImageForecastProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ position: 'sticky', top: 0, left: 0, backgroundColor: 'white', zIndex: 6 }}>
            Spot Name
          </th>
          {forecasts[0].forecast.periods.map((period) => (
            <th style={{ position: 'sticky', top: 0, backgroundColor: 'white' }} key={period.name}>
              {period.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {forecasts.map(({ forecast, spot }) => (
          <tr key={spot.name}>
            <td className={'StickyForecastColumn'}>{spot.name}</td>
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
