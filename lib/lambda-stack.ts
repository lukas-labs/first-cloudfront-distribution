import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class LambdaStack extends cdk.Stack {
  // Implementation of LambdaStack goes here
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // 3. Create Lambda function to fetch content from S3 bucket

    const fetchS3 = new lambda.Function(this, 'FetchS3WebsiteLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./fetch-s3-content'), // folder containing index.js
    });

    // 2. Create API Gateway HTTP API
    const httpApi = new apigateway.HttpApi(this, 'MyHttpApi', {
      apiName: 'MyTestApi',
      createDefaultStage: true,
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [apigateway.CorsHttpMethod.GET, apigateway.CorsHttpMethod.OPTIONS],
      }
    });

    // 3. Add route with Lambda integration
    httpApi.addRoutes({
      path: '/test',
      methods: [apigateway.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration('LambdaIntegration', fetchS3),
    });

    // 4. Output API endpoint
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.apiEndpoint + "/test?url=",
    });
  }
}
