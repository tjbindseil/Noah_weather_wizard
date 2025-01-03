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
  minX: Date;
  maxX: Date;
}

export const HourlyForecastChart = ({ series, title, minX, maxX }: HourlyForecastChartProps) => {
  const primaryAxis = useMemo(
    (): AxisOptions<Point> => ({
      getValue: (datum) => datum.date,
      scaleType: 'time',
      min: minX,
      max: maxX,
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
      <h4 style={{ height: 40 }}>{title}</h4>
      <div style={{ height: 320 }}>
        <Chart
          options={{
            data: series,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </div>
  );
};
