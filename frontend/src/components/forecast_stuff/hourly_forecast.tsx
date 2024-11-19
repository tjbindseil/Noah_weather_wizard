import { useMemo } from 'react';
import { AxisOptions, Chart } from 'react-charts';

type Point = {
  date: Date;
  value: number;
};

export type HourlySeries = {
  label: string;
  data: Point[];
};

interface HourlyForecastProps {
  series: HourlySeries[];
}

export const HourlyForecast = ({ series }: HourlyForecastProps) => {
  const primaryAxis = useMemo(
    (): AxisOptions<Point> => ({
      getValue: (datum) => datum.date,
      scaleType: 'time',
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<Point>[] => [
      {
        getValue: (datum) => datum.value,
        scaleType: 'linear',
      },
    ],
    [],
  );

  return (
    <div>
      <Chart
        options={{
          data: series,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};
