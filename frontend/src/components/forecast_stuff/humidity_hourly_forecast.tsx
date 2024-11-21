import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecastChart, HourlySeries } from './hourly_forecast_chart';

interface HourlyHumidityForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
  minX: Date;
  maxX: Date;
}

export const HourlyHumidityForecast = ({
  forecastsHourly,
  minX,
  maxX,
}: HourlyHumidityForecastProps) => {
  const humiditySeries: HourlySeries[] = [];
  forecastsHourly.forEach((data: { spot: Spot; forecastHourly: ForecastHourly }) => {
    humiditySeries.push({
      label: data.spot.name,
      data: data.forecastHourly.periods
        .filter((p) => p.relativeHumidity)
        .map((p) => {
          // this is ok because we filter above
          const humidityValue = p.relativeHumidity?.value as number;

          return {
            value: humidityValue,
            date: new Date(p.startTime),
          };
        }),
    });
  });

  return (
    <HourlyForecastChart
      series={humiditySeries}
      title={'Humidity (percentage)'}
      minX={minX}
      maxX={maxX}
    />
  );
};
