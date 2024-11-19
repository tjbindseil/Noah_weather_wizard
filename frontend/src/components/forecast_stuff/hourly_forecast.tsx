import { useMemo } from 'react';
import { AxisOptions, Chart } from 'react-charts';
import { ForecastHourly, Spot } from 'ww-3-models-tjb';

type DailyStars = {
  date: Date;
  stars: number;
};

type Series = {
  label: string;
  data: DailyStars[];
};

const rightNow = new Date();

const hoursFromNow = (hours: number) => {
  return new Date(rightNow.setHours(rightNow.getHours() + hours));
};

// whoa
// 'React Charts' => Longs Peak Temperature
// 'React Query' => Mt Whitney Temperature
const data: Series[] = [
  {
    label: 'React Charts',
    data: [
      {
        date: hoursFromNow(0),
        stars: 202123,
      },
      {
        date: hoursFromNow(1),
        stars: 102123,
      },
      {
        date: hoursFromNow(2),
        stars: 52123,
      },
      {
        date: hoursFromNow(3),
        stars: 26123,
      },
      {
        date: hoursFromNow(4),
        stars: 13123,
      },
      // ...
    ],
  },
  {
    label: 'React Query',
    data: [
      {
        date: new Date(),
        stars: 134230,
      },
      // ...
    ],
  },
];

interface HourlyForecastProps {
  forecastsHourly: {
    forecastHourly: ForecastHourly;
    spot: Spot;
  }[];
}

export const HourlyForecast = ({ forecastsHourly }: HourlyForecastProps) => {
  forecastsHourly;

  const primaryAxis = useMemo(
    (): AxisOptions<DailyStars> => ({
      getValue: (datum) => datum.date,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyStars>[] => [
      {
        getValue: (datum) => datum.stars,
      },
    ],
    [],
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );

  //     number: number;
  //     name: string;
  //     startTime: string;
  //     endTime: string;
  //     isDaytime: boolean;
  //     temperature: number;
  //     temperatureUnit: string;
  //     temperatureTrend: string;
  //     probabilityOfPrecipitation: {
  //         unitCode: string;
  //         value: number | null;
  //     };
  //     relativeHumidity: {
  //         unitCode: string;
  //         value: number | null;
  //     };
  //     windSpeed: string;
  //     windDirection: string;
  //     icon: string;
  //     shortForecast: string;
  //     detailedForecast: string;
  //
  //     ok, so whats gonna go down here?
  //     1. read all forecastHourly and get the time frames
  //     each time frame has a start and an end
  //     2. then, for each timeframe, determine the map of spot => period
  //     3. for each of { temp, windspeed, prob of precip, humidity }
  //     graph the respective value for each period and all of the spots in different colors
  //
  //     TODO control which respective values are shown dynamically?
  //     maybe each on their own graph is better, since the values are gonna be all over the place
  //     so I guess this ends up being temperature or something
};
