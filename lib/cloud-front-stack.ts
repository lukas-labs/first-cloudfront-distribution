import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CloudFrontStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create S3 bucket
    const bucket = new s3.Bucket(this, 'TestBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // auto-delete bucket when stack is deleted
      autoDeleteObjects: true, // allow cleanup
      bucketName: 'cloudfront-labs-website-bucket',
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }
    });

    // 2. Deploy static website to S3 bucket
    new s3deploy.BucketDeployment(this, 'IndexHtml', {
      sources: [s3deploy.Source.asset('./webcontent/')],
      destinationBucket: bucket,
      retainOnDelete: false, // auto-delete files when stack is deleted
    })

    new cdk.CfnOutput(this, 'WebContentUrl', {
      value: `https://${bucket.bucketDomainName}/index.html`,
    });


  }
}
