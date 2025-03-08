import { Construct } from 'constructs';
import { aws_s3, aws_s3_deployment, aws_apigateway, aws_lambda,
  Stack, RemovalPolicy, StackProps, Duration, aws_s3_notifications, CfnOutput } from 'aws-cdk-lib';
import { LayerStack } from './layer.stack';

export class ImportStack extends Stack {
  constructor(scope: Construct, id: string, layerStack: LayerStack, props?: StackProps) {
    super(scope, id, props);

    const bucket = new aws_s3.Bucket(this, 'artRSSShopFilesBucket', {
      bucketName: 'art-rss-shop-bucket',
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN, // Bucket persists after stack deletion
      autoDeleteObjects: false, // Prevent accidental object deletions during "destroy"
    });

    // Create an "empty folder" placeholder
    new aws_s3_deployment.BucketDeployment(this, 'CreateUploadedFolder', {
      sources: [aws_s3_deployment.Source.data('./configs/empty.txt', '')], // Adding a zero-byte file as a "folder"
      destinationBucket: bucket,
      destinationKeyPrefix: 'uploaded/', // Acts as a folder
    });

    const importProductsFileLambda = new aws_lambda.Function(this, 'importProductsFile', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'import-files.handler',
      code: aws_lambda.Code.fromAsset('./dist/import_service/handlers'),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      layers: [layerStack.sharedLayer],
    });

    bucket.grantReadWrite(importProductsFileLambda);

    const fileParserLambda = new aws_lambda.Function(this, 'ImportFileParserLambda', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'file-parser.handler',
      code: aws_lambda.Code.fromAsset('./dist/import_service/handlers'),
      memorySize: 128,
      timeout: Duration.seconds(30),
      layers: [layerStack.sharedLayer],
    });

    bucket.grantRead(fileParserLambda);
    bucket.grantWrite(fileParserLambda);
    bucket.grantDelete(fileParserLambda);

    bucket.addEventNotification(
      aws_s3.EventType.OBJECT_CREATED,
      new aws_s3_notifications.LambdaDestination(fileParserLambda),
      { prefix: 'uploaded/' } // Only trigger the event for objects with this prefix
    );

    const api = new aws_apigateway.RestApi(this, 'ImportServiceApi', {
      restApiName: 'Import Service API',
      description: 'API for importing product CSV files',
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET'],
      },
    });

    const importResource = api.root.addResource('import');
    importResource.addMethod(
      'GET',
      new aws_apigateway.LambdaIntegration(importProductsFileLambda),
      {
        requestParameters: {
          'method.request.querystring.name': true,
        },
      }
    );

    new CfnOutput(this, 'ImportServiceApi', {
      value: api.url,
      description: 'The base URL of the Import Service API',
    });

    new CfnOutput(this, 'artRSSShopFilesBucketName', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket for imported files',
    });
  }
}
