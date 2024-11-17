import { CloudWatch } from 'aws-sdk';

// Create a CloudWatch client
const cloudwatch = new CloudWatch({ region: 'us-east-1' });

/**
 * Publishes a custom metric to Amazon CloudWatch.
 *
 * @param metricName - The name of the metric to publish.
 * @param value - The value of the metric.
 * @param namespace - The namespace under which the metric is grouped.
 */
export async function publishMetric(
    metricName: string,
    value: number,
    namespace = 'WW/Metrics'
): Promise<void> {
    const params: CloudWatch.PutMetricDataInput = {
        MetricData: [
            {
                MetricName: metricName,
                Unit: 'Count', // Adjust the unit as per your needs (e.g., 'Milliseconds', 'Percent').
                Value: value,
            },
        ],
        Namespace: namespace, // Example: 'MyApp/Metrics'
    };

    try {
        await cloudwatch.putMetricData(params).promise();
        console.log(`Successfully published metric: ${metricName}`);
    } catch (err) {
        console.error('Failed to publish metric:', err);
        // throw err; // Optionally re-throw to handle upstream.
    }
}
