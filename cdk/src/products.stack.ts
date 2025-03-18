import { aws_apigateway, aws_lambda, aws_lambda_event_sources, aws_sns, aws_sns_subscriptions, CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { defaultCorsPreflightOptions, getCorsMethodOptions } from './configs';
import { LayerStack } from './layer.stack';

export class ProductsStack extends Stack {
  constructor(scope: Construct, id: string,  layerStack: LayerStack, props?: StackProps) {
    super(scope, id, props);

    const productTable: ITable = Table.fromTableName(this, 'ProductTable', process.env.PRODUCT_TABLE ?? '');
    const stockTable: ITable = Table.fromTableName(this, 'StockTable', process.env.STOCK_TABLE ?? '');

    const productsList: aws_lambda.Function = new aws_lambda.Function(this, 'ArtRssShopProductsList', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'products-list.productsListHandler',
      code: aws_lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        PRODUCT_TABLE: productTable.tableName,
        STOCK_TABLE: stockTable.tableName,
      },
      layers: [layerStack.sharedLayer],
    });
    productTable.grantReadData(productsList);
    stockTable.grantReadData(productsList);

    const productById: aws_lambda.Function = new aws_lambda.Function(this, 'ArtRssShopProductById', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'product-by-id.productByIdHandler',
      code: aws_lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        PRODUCT_TABLE: productTable.tableName,
        STOCK_TABLE: stockTable.tableName,
      },
      layers: [layerStack.sharedLayer],
    });

    productTable.grantReadData(productById);
    stockTable.grantReadData(productById);

    const createProduct: aws_lambda.Function = new aws_lambda.Function(this, 'ArtRssShopCreateProduct', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'create-product.createProductHandler',
      code: aws_lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        PRODUCT_TABLE: productTable.tableName,
        STOCK_TABLE: stockTable.tableName,
      },
      layers: [layerStack.sharedLayer],
      timeout: Duration.seconds(10),
    });

    productTable.grantWriteData(createProduct);
    stockTable.grantWriteData(createProduct);

    const api = new aws_apigateway.RestApi(this, 'ArtRssShopProductsServiceApi', {
      restApiName: 'Products Service API',
      defaultCorsPreflightOptions,
    });

    const productsResource = api.root.addResource('products');
    const productIdResource = productsResource.addResource('{productId}');

    productsResource.addMethod('GET', new aws_apigateway.LambdaIntegration(productsList), getCorsMethodOptions());
    productsResource.addMethod('POST', new aws_apigateway.LambdaIntegration(createProduct), getCorsMethodOptions());

    productIdResource.addMethod('PUT', new aws_apigateway.LambdaIntegration(productById), getCorsMethodOptions());
    productIdResource.addMethod('DELETE', new aws_apigateway.LambdaIntegration(productById), getCorsMethodOptions());
    productIdResource.addMethod('GET', new aws_apigateway.LambdaIntegration(productById), getCorsMethodOptions());

    const catalogItemsQueue = layerStack.catalogItemsQueue;
    const createProductTopicName: string = process.env.CREATE_PRODUCT_TOPIC || '';

    const createProductTopic = new aws_sns.Topic(this, createProductTopicName, {
      topicName: createProductTopicName,
    });

    const DEFAULT_EMAIL: string = process.env.DEFAULT_EMAIL || '';
    const VIP_EMAIL: string = process.env.VIP_EMAIL || '';
    const PRICE_LIMIT: number = Number(process.env.PRICE_LIMIT ?? 0);

    createProductTopic.addSubscription(
      new aws_sns_subscriptions.EmailSubscription(VIP_EMAIL, {
        filterPolicy: {
          price: aws_sns.SubscriptionFilter.numericFilter({
            greaterThan: PRICE_LIMIT,
          }),
        },
      })
    );

    createProductTopic.addSubscription(
      new aws_sns_subscriptions.EmailSubscription(DEFAULT_EMAIL, {
        filterPolicy: {
          price: aws_sns.SubscriptionFilter.numericFilter({
            lessThanOrEqualTo: PRICE_LIMIT,
          }),
        },
      })
    );

    const catalogBatchProcess = new aws_lambda.Function(this, 'ArtRssShopCatalogBatchProcess', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'catalog-batch-process.catalogBatchProcessHandler',
      code: aws_lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        SNS_TOPIC_ARN: createProductTopic.topicArn,
        CREATE_PRODUCT_NAME: createProduct.functionName,
      },
      layers: [layerStack.sharedLayer],
      timeout: Duration.seconds(30),
    });

    createProductTopic.grantPublish(catalogBatchProcess);
    createProduct.grantInvoke(catalogBatchProcess);

    const sqsEventSource = new aws_lambda_event_sources.SqsEventSource(catalogItemsQueue, {
      reportBatchItemFailures: true,
      batchSize: 5,
    });
    catalogBatchProcess.addEventSource(sqsEventSource);
    catalogItemsQueue.grantConsumeMessages(catalogBatchProcess);

    new CfnOutput(this, 'ArtRssShopCreateProductTopicARN', {
      value: createProductTopic.topicArn,
      description: 'ARN of the createProductTopic SNS Topic',
    });
  }
}
