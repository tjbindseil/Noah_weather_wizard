import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyTemperatureForecast } from './temperature_hourly_forecast';
import { HourlyHumidityForecast } from './humidity_hourly_forecast';
import { HourlyWindSpeedForecast } from './wind_speed_hourly_forecast';
import { HourlyPrecipPercentForecast } from './precip_hourly_forecast';

interface AllHourlyForecastChartsProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
}

export const AllHourlyForecastCharts = ({ forecastsHourly }: AllHourlyForecastChartsProps) => {
  const allDates: Date[] = [];
  forecastsHourly.forEach((d) =>
    d.forecastHourly.periods.forEach((p) => allDates.push(new Date(p.startTime))),
  );

  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const tomorrow = new Date(today.setDate(today.getDate() + 1));
  const minDate = allDates.reduce((p, v) => (p < v ? p : v), tomorrow);
  const maxDate = allDates.reduce((p, v) => (p > v ? p : v), yesterday);

  return (
    <>
      <HourlyTemperatureForecast forecastsHourly={forecastsHourly} minX={minDate} maxX={maxDate} />
      <HourlyHumidityForecast forecastsHourly={forecastsHourly} minX={minDate} maxX={maxDate} />
      <HourlyWindSpeedForecast forecastsHourly={forecastsHourly} minX={minDate} maxX={maxDate} />
      <HourlyPrecipPercentForecast
        forecastsHourly={forecastsHourly}
        minX={minDate}
        maxX={maxDate}
      />
    </>
  );
};
