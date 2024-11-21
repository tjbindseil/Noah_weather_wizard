import { ForecastHourly, Spot } from 'ww-3-models-tjb';
import { HourlyForecastChart, HourlySeries } from './hourly_forecast_chart';

interface HourlyTemperatureForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
  minX: Date;
  maxX: Date;
}

export const HourlyTemperatureForecast = ({
  forecastsHourly,
  minX,
  maxX,
}: HourlyTemperatureForecastProps) => {
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

  return (
    <HourlyForecastChart series={tempSeries} title={'Temperature (F)'} minX={minX} maxX={maxX} />
  );
};
