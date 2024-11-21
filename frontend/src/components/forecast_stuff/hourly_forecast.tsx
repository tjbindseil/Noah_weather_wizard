import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyTemperatureForecast } from './temperature_hourly_forecast';
import { HourlyHumidityForecast } from './humidity_hourly_forecast';
import { HourlyWindSpeedForecast } from './wind_speed_hourly_forecast';
import { HourlyPrecipPercentForecast } from './precip_hourly_forecast';

interface HourlyForecastProps {
  forecastsHourly: {
    spot: Spot;
    forecastHourly: ForecastHourly;
  }[];
  minX: Date;
  maxX: Date;
}

export const HourlyForecast = ({ forecastsHourly, minX, maxX }: HourlyForecastProps) => {
  return (
    <>
      <HourlyTemperatureForecast forecastsHourly={forecastsHourly} minX={minX} maxX={maxX} />
      <HourlyHumidityForecast forecastsHourly={forecastsHourly} minX={minX} maxX={maxX} />
      <HourlyWindSpeedForecast forecastsHourly={forecastsHourly} minX={minX} maxX={maxX} />
      <HourlyPrecipPercentForecast forecastsHourly={forecastsHourly} minX={minX} maxX={maxX} />
    </>
  );
};
