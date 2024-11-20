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
  return (
    <div className={'HourlyForecast'}>
      <HourlyTemperatureForecast forecastsHourly={forecastsHourly} />
      <HourlyHumidityForecast forecastsHourly={forecastsHourly} />
      <HourlyWindSpeedForecast forecastsHourly={forecastsHourly} />
      <HourlyPrecipPercentForecast forecastsHourly={forecastsHourly} />
    </div>
  );
};
