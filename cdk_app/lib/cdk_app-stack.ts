import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { DatabaseSecret } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { Environment } from 'ww-3-app-config-tjb';

export class CdkAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // create VPC in which we'll launch the Instance
        const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
            cidr: '10.0.0.0/16',
            natGateways: 0,
            subnetConfiguration: [
                {
                    name: 'public',
                    cidrMask: 24,
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    name: 'isolated-subnet-1',
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 28,
                },
            ],
        });

        // create Security Group for the Instance
        const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
            vpc,
            allowAllOutbound: true,
        });

        webserverSG.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(22),
            'allow SSH access from anywhere'
        );

        webserverSG.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(80),
            'allow HTTP traffic from anywhere'
        );

        webserverSG.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(8888),
            'allow staging HTTP traffic from anywhere'
        );

        webserverSG.addIngressRule(
            ec2.Peer.anyIpv4(),
            ec2.Port.tcp(443),
            'allow HTTPS traffic from anywhere'
        );

        // TODO create s3 adapter test bucket in cdk
        // Create an S3 bucket for forecasts in each env
        const buckets = Object.keys(Environment).map(
            (env) =>
                new s3.Bucket(this, `ww-${env}-forecast-bucket`, {
                    bucketName: `ww-${env}-forecast`,
                    versioned: false,
                    removalPolicy: cdk.RemovalPolicy.DESTROY,
                    publicReadAccess: false,
                })
        );

        // create a Role for the EC2 Instance
        const webserverRole = new iam.Role(this, 'webserver-role', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName(
                    'AmazonCognitoPowerUser' // TODO absorb cognito identity pool here and be more specific
                ),
            ],
        });
        buckets.forEach((bucket) => bucket.grantReadWrite(webserverRole));

        // Cost: $.40/month
        const dbSecret = new DatabaseSecret(this, 'PictureDatabaseSecret', {
            username: 'postgres',
        });
        dbSecret.grantRead(webserverRole);

        const ec2Instance = new ec2.Instance(this, 'ec2-instance', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            role: webserverRole,
            securityGroup: webserverSG,
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE2,
                ec2.InstanceSize.MICRO
            ),
            machineImage: new ec2.AmazonLinuxImage({
                generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
            }),
            keyName: 'ec2-key-pair',
        });

        const dbInstance = new rds.DatabaseInstance(this, 'db-instance', {
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            },
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_14,
            }),
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.BURSTABLE3,
                ec2.InstanceSize.MICRO
            ),
            credentials: rds.Credentials.fromSecret(dbSecret),
            multiAz: false,
            allocatedStorage: 15,
            maxAllocatedStorage: 20,
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: true,
            backupRetention: cdk.Duration.days(0),
            deleteAutomatedBackups: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'dwf_db', // TODO if redoing this, change to ww_db
            publiclyAccessible: false,
        });

        dbInstance.connections.allowFrom(ec2Instance, ec2.Port.tcp(5432));
        dbInstance.connections.securityGroups.forEach((sg) => {
            sg.addIngressRule(
                ec2.Peer.anyIpv4(),
                ec2.Port.icmpPing(),
                'Allow ping from anywhere'
            );
        });

        new cdk.CfnOutput(this, 'dbEndpoint', {
            value: dbInstance.instanceEndpoint.hostname,
        });

        new cdk.CfnOutput(this, 'secretName', {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            value: dbInstance.secret?.secretName!,
        });
    }
}
