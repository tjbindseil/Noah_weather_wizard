import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecast, HourlySeries } from './hourly_forecast';

interface HourlyTemperatureForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
}

export const HourlyTemperatureForecast = ({ forecastsHourly }: HourlyTemperatureForecastProps) => {
  const tempSeries: HourlySeries[] = [];
  forecastsHourly.forEach((data: { spot: Spot; forecastHourly: ForecastHourly }) => {
    tempSeries.push({
      label: data.spot.name,
      data: data.forecastHourly.periods.map((p) => ({
        value: p.temperature,
        date: new Date(p.startTime),
      })),
    });
  });

  return <HourlyForecast series={tempSeries} />;
};
