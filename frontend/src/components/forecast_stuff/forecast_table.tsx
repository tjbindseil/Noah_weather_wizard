import { ReactElement } from 'react';
import { Forecast, Period, Spot } from 'ww-3-models-tjb';

interface ForecastProps {
  forecasts: {
    forecast: Forecast;
    spot: Spot;
  }[];
  periodFunc: (p: Period, s: Spot) => ReactElement;
}

export const ForecastTable = ({ forecasts, periodFunc }: ForecastProps) => {
  return (
    <table style={{ borderSpacing: 0 }}>
      <thead>
        <tr>
          <th className={'StickyTableHeader'} style={{ zIndex: 10 }}>
            Spot Name
          </th>
          {forecasts[0].forecast.periods.map((period) => (
            <th className={'StickyTableHeader'} key={period.name}>
              {period.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {forecasts.map(({ forecast, spot }) => (
          <tr key={spot.name}>
            <td className={'StickyForecastColumn'}>{spot.name}</td>
            {forecast.periods.map((p) => periodFunc(p, spot))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
