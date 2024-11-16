import { ForecastKey, S3Adapter, getForecast } from 'ww-3-utilities-tjb';
import { make_fetch_forcast } from '../../src/forecast_fetcher';
import { publishMetric } from 'ww-3-api-tjb';

jest.mock('ww-3-utilities-tjb', () => ({
    ...jest.requireActual('ww-3-utilities-tjb'),
    getForecast: jest.fn(),
}));
const mockGetForecast = jest.mocked(getForecast);
jest.mock('ww-3-api-tjb');
const mockPublishMetric = jest.mocked(publishMetric);

describe('forecast_fetcher tests', () => {
    const mockGetAllPolygons = jest.fn();
    const mockS3Adapter = {
        getAllPolygons: mockGetAllPolygons,
    } as unknown as S3Adapter;
    const forecastFetchFunc = make_fetch_forcast(mockS3Adapter);

    beforeEach(() => {
        mockGetForecast.mockClear();
        mockPublishMetric.mockClear();
        mockGetAllPolygons.mockClear();
    });

    it('adds a counter when forecast fails to fetch', async () => {
        mockGetForecast.mockRejectedValue(new Error('error'));
        mockGetAllPolygons.mockResolvedValue([new ForecastKey('PID', 4, 20)]);

        await forecastFetchFunc();

        expect(mockPublishMetric).toHaveBeenCalledWith(
            'FORECAST_FETCHER_FAILED_FETCH',
            1
        );
    });
});

// TODO here:
// * sites enabled nginx
// * PM2 on ec2 init
// * add metric on cdk
// import * as cdk from 'aws-cdk-lib';
// import { Stack, StackProps } from 'aws-cdk-lib';
// import * as cw from 'aws-cdk-lib/aws-cloudwatch';
//
// export class MonitoringStack extends Stack {
//   constructor(scope: cdk.App, id: string, props?: StackProps) {
//     super(scope, id, props);
//
//     // Define a custom metric
//     const requestCountMetric = new cw.Metric({
//       namespace: 'MyApp/Metrics',
//       metricName: 'RequestCount',
//       statistic: 'Sum',
//       period: cdk.Duration.minutes(1),
//     });
//
//     // Create an alarm for the metric
//     new cw.Alarm(this, 'HighRequestCountAlarm', {
//       metric: requestCountMetric,
//       threshold: 100,
//       evaluationPeriods: 2,
//     });
//   }
// }
//
// * crete dashboard on cdk
// import * as cw from 'aws-cdk-lib/aws-cloudwatch';
//
// const dashboard = new cw.Dashboard(this, 'AppDashboard', {
//   dashboardName: 'MyAppDashboard',
// });
//
// // Add the metric to the dashboard
// dashboard.addWidgets(
//   new cw.GraphWidget({
//     title: 'Request Count',
//     left: [requestCountMetric],
//   })
// );
//
