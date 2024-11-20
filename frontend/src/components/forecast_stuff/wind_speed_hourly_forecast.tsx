import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecastChart, HourlySeries } from './hourly_forecast_chart';

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
          const windSpeedString = p.windSpeed as string;
          const windSpeedValue = Number(windSpeedString.split(' ')[0]);

          return {
            value: windSpeedValue,
            date: new Date(p.startTime),
          };
        }),
    });
  });

  windSpeedSeries.forEach((hs) => console.log(`hs is: ${JSON.stringify(hs)}`));

  return <HourlyForecastChart series={windSpeedSeries} title={'Wind Speed (mph)'} />;
};
