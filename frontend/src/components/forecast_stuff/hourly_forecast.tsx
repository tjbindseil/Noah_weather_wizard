import { useMemo } from 'react';
import { AxisOptions, Chart } from 'react-charts';
import { ForecastHourly, Period, Spot } from 'ww-3-models-tjb';

type TempPoint = {
  date: Date;
  temp: number;
};

type TempSeries = {
  label: string;
  data: TempPoint[];
};

interface HourlyForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
}

export const HourlyForecast = ({ forecastsHourly }: HourlyForecastProps) => {
  const tempMap = new Map<Spot, Period[]>();
  forecastsHourly.forEach((data: { spot: Spot; forecastHourly: ForecastHourly }) => {
    tempMap.set(data.spot, data.forecastHourly.periods);
  });

  const tempSeries: TempSeries[] = [];
  tempMap.forEach((periods, spot) => {
    tempSeries.push({
      label: spot.name,
      data: periods.map((p) => ({
        temp: p.temperature,
        date: new Date(p.startTime),
      })),
    });
  });

  const primaryAxis = useMemo(
    (): AxisOptions<TempPoint> => ({
      getValue: (datum) => datum.date,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<TempPoint>[] => [
      {
        getValue: (datum) => datum.temp,
      },
    ],
    [],
  );

  return (
    <Chart
      options={{
        data: tempSeries,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
};
