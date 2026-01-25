/**
 * GitHub Proxy Lambda Stack
 * 
 * This CDK stack deploys:
 * - Lambda function for GitHub API proxy
 * - API Gateway endpoint
 * - IAM roles and policies
 * - CloudWatch logs
 */

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as path from 'path';
import { Construct } from 'constructs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface GitHubProxyStackProps extends cdk.StackProps {
  environment?: string;
}

export class GitHubProxyStack extends cdk.Stack {
  public readonly apiEndpoint: string;
  public readonly functionArn: string;

  constructor(scope: Construct, id: string, props?: GitHubProxyStackProps) {
    super(scope, id, props);

    const environment = props?.environment || 'dev';

    // Create IAM role for Lambda
    const lambdaRole = new iam.Role(this, 'GitHubProxyLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role for GitHub Proxy Lambda function',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Create CloudWatch Log Group
    const logGroup = new logs.LogGroup(this, 'GitHubProxyLogGroup', {
      logGroupName: `/aws/lambda/github-proxy-${environment}`,
      retention: logs.RetentionDays.TWO_WEEKS,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda function
    const githubProxyFunction = new lambda.Function(this, 'GitHubProxyFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist/github-proxy')),
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      environment: {
        LOG_GROUP: logGroup.logGroupName,
        ENVIRONMENT: environment,
      },
      description: 'GitHub API proxy for bypassing CORS restrictions',
      logGroup: logGroup,
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'GitHubProxyAPI', {
      restApiName: `github-proxy-${environment}`,
      description: 'GitHub API proxy endpoint',
      deployOptions: {
        stageName: environment,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        throttlingBurstLimit: 100,
        throttlingRateLimit: 50,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Create /proxy resource
    const proxyResource = api.root.addResource('proxy');

    // Add POST method
    proxyResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(githubProxyFunction),
      {
        methodResponses: [
          {
            statusCode: '200',
            responseModels: {
              'application/json': apigateway.Model.EMPTY_MODEL,
            },
          },
          {
            statusCode: '400',
            responseModels: {
              'application/json': apigateway.Model.EMPTY_MODEL,
            },
          },
          {
            statusCode: '500',
            responseModels: {
              'application/json': apigateway.Model.EMPTY_MODEL,
            },
          },
        ],
      }
    );

    // Store outputs
    this.apiEndpoint = api.url;
    this.functionArn = githubProxyFunction.functionArn;

    // Output the API endpoint
    new cdk.CfnOutput(this, 'GitHubProxyAPIEndpoint', {
      value: this.apiEndpoint,
      description: 'GitHub Proxy API endpoint URL',
      exportName: `github-proxy-api-${environment}`,
    });

    new cdk.CfnOutput(this, 'GitHubProxyFunctionArn', {
      value: this.functionArn,
      description: 'GitHub Proxy Lambda function ARN',
      exportName: `github-proxy-function-${environment}`,
    });

    new cdk.CfnOutput(this, 'GitHubProxyProxyEndpoint', {
      value: `${this.apiEndpoint}proxy`,
      description: 'GitHub Proxy endpoint (use this in your frontend)',
      exportName: `github-proxy-endpoint-${environment}`,
    });
  }
}

// App definition
const app = new cdk.App();

// Deploy to dev environment
new GitHubProxyStack(app, 'GitHubProxyStackDev', {
  environment: 'dev',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

// Deploy to prod environment (optional)
if (process.env.DEPLOY_PROD === 'true') {
  new GitHubProxyStack(app, 'GitHubProxyStackProd', {
    environment: 'prod',
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    },
  });
}

app.synth();
