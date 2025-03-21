import { Construct } from 'constructs';
import { aws_s3, aws_s3_deployment, aws_apigateway, aws_lambda,
  Stack, RemovalPolicy, StackProps, Duration, aws_s3_notifications, CfnOutput, 
  aws_iam,
  Fn} from 'aws-cdk-lib';
import { LayerStack } from './layer.stack';
import * as path from 'path';
import { defaultCorsPreflightOptions, getCorsMethodOptions } from './configs';

export class ImportStack extends Stack {
  constructor(scope: Construct, id: string, layerStack: LayerStack, props: StackProps) {
    super(scope, id, props);

    const artRssShopFilesBucket = new aws_s3.Bucket(this, 'ArtRssShopFilesBucket', {
      bucketName: 'art-rss-shop-bucket',
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN, // Bucket persists after stack deletion
      autoDeleteObjects: false, // Prevent accidental object deletions during "destroy"
    });

    const assetsPath: string = path.resolve(__dirname, '../../assets');
    console.log(assetsPath);

    // Create an "empty folder" placeholder
    new aws_s3_deployment.BucketDeployment(this, 'ArtRssShopCreateUploadedFolder', {
      sources: [aws_s3_deployment.Source.asset(assetsPath)],
      destinationBucket: artRssShopFilesBucket,
      destinationKeyPrefix: 'uploaded/', // Acts as a folder
    });

    const importProductsFileLambda = new aws_lambda.Function(this, 'ArtRssShopImportProductsFile', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'import-files.importFilesHandler',
      code: aws_lambda.Code.fromAsset('./dist/import_service/handlers'),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        BUCKET_NAME: artRssShopFilesBucket.bucketName,
      },
      layers: [layerStack.sharedLayer],
    });

    artRssShopFilesBucket.grantReadWrite(importProductsFileLambda);

    const catalogItemsQueue = layerStack.catalogItemsQueue;

    const fileParserLambda = new aws_lambda.Function(this, 'ArtRssShopImportFileParserLambda', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'file-parser.fileParserHandler',
      code: aws_lambda.Code.fromAsset('./dist/import_service/handlers'),
      memorySize: 128,
      timeout: Duration.seconds(30),
      environment: {
        SQS_QUEUE_URL: catalogItemsQueue.queueUrl,
      },
      layers: [layerStack.sharedLayer],
    });

    fileParserLambda.addToRolePolicy(new aws_iam.PolicyStatement({
      actions: ["sqs:SendMessage"],
      resources: [catalogItemsQueue.queueArn],
    }));

    artRssShopFilesBucket.grantRead(fileParserLambda);
    artRssShopFilesBucket.grantWrite(fileParserLambda);
    artRssShopFilesBucket.grantDelete(fileParserLambda);

    artRssShopFilesBucket.addEventNotification(
      aws_s3.EventType.OBJECT_CREATED,
      new aws_s3_notifications.LambdaDestination(fileParserLambda),
      { prefix: 'uploaded/' } // Only trigger the event for objects with this prefix
    );

    const api = new aws_apigateway.RestApi(this, 'ArtRssShopImportServiceApi', {
      restApiName: 'Import Service API',
      description: 'API for importing product CSV files',
      defaultCorsPreflightOptions: {
        ...defaultCorsPreflightOptions,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const authorizerLambdaArn = Fn.importValue('BasicAuthorizerLambdaArn');
    const basicAuthorizerLambda = aws_lambda.Function.fromFunctionArn(this, 'ImportBasicAuthorizerLambda', authorizerLambdaArn);

    const authorizer = new aws_apigateway.TokenAuthorizer(this, 'ArtRssShopBasicAuthorizerToken', {
      handler: basicAuthorizerLambda,
      resultsCacheTtl: Duration.seconds(0), // Disable caching (important for real-time validation)
    });

    const importResource = api.root.addResource('import');
    importResource.addMethod(
      'GET',
      new aws_apigateway.LambdaIntegration(importProductsFileLambda),
      {
        authorizationType: aws_apigateway.AuthorizationType.CUSTOM,
        authorizer,
        ...getCorsMethodOptions(),
        requestParameters: {
          'method.request.querystring.name': true,
        },
      }
    );

    new CfnOutput(this, 'ArtRssShopImportServiceApiOutput', {
      value: api.url,
      description: 'The base URL of the Import Service API',
    });

    new CfnOutput(this, 'ArtRssShopFilesBucketNameOutput', {
      value: artRssShopFilesBucket.bucketName,
      description: 'The name of the S3 bucket for imported files',
    });
  }
}
