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

interface HourlyForecastChartProps {
  series: HourlySeries[];
  title: string;
}

export const HourlyForecastChart = ({ series, title }: HourlyForecastChartProps) => {
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
      <h4>{title}</h4>
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
