import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecast, HourlySeries } from './hourly_forecast';

interface HourlyPrecipPercentForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
}

export const HourlyPrecipPercentForecast = ({
  forecastsHourly,
}: HourlyPrecipPercentForecastProps) => {
  const precipPercentSeries: HourlySeries[] = [];
  forecastsHourly.forEach((data: { spot: Spot; forecastHourly: ForecastHourly }) => {
    precipPercentSeries.push({
      label: data.spot.name,
      data: data.forecastHourly.periods
        .filter((p) => p.probabilityOfPrecipitation.value)
        .map((p) => {
          // this is ok because we filter above
          const precipPercentValue = p.probabilityOfPrecipitation.value as number;

          return {
            value: precipPercentValue,
            date: new Date(p.startTime),
          };
        }),
    });
  });

  return <HourlyForecast series={precipPercentSeries} />;
};
