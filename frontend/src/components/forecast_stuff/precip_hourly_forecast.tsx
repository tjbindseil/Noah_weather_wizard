import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecastChart, HourlySeries } from './hourly_forecast_chart';

interface HourlyPrecipPercentForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
  minX: Date;
  maxX: Date;
}

export const HourlyPrecipPercentForecast = ({
  forecastsHourly,
  minX,
  maxX,
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

  return (
    <HourlyForecastChart
      series={precipPercentSeries}
      title={'Probability of Precipitation'}
      minX={minX}
      maxX={maxX}
    />
  );
};
