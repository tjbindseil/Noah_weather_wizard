import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecast, HourlySeries } from './hourly_forecast';

interface HourlyWindSpeedForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
}

export const HourlyWindSpeedForecast = ({ forecastsHourly }: HourlyWindSpeedForecastProps) => {
  const windSpeedSeries: HourlySeries[] = [];
  forecastsHourly.forEach((data: { spot: Spot; forecastHourly: ForecastHourly }) => {
    windSpeedSeries.push({
      label: data.spot.name,
      data: data.forecastHourly.periods
        .filter((p) => p.windSpeed)
        .map((p) => {
          // this is ok because we filter above
          const windSpeedValue = Number(p.windSpeed as string);

          return {
            value: windSpeedValue,
            date: new Date(p.startTime),
          };
        }),
    });
  });

  return <HourlyForecast series={windSpeedSeries} />;
};
