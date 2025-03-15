import { Stack, StackProps, aws_lambda, aws_apigateway } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { defaultCorsPreflightOptions, getCorsMethodOptions } from './configs';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { LayerStack } from './layer.stack';

export class ProductsStack extends Stack {
  constructor(scope: Construct, id: string,  layerStack: LayerStack, props?: StackProps) {
    super(scope, id, props);

    const productTable: ITable = Table.fromTableName(this, 'ProductTable', process.env.PRODUCT_TABLE ?? '');
    const stockTable: ITable = Table.fromTableName(this, 'StockTable', process.env.STOCK_TABLE ?? '');

    const productsList: aws_lambda.Function = new aws_lambda.Function(this, 'ProductsList', {
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

    const productById: aws_lambda.Function = new aws_lambda.Function(this, 'ProductById', {
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

    const createProduct: aws_lambda.Function = new aws_lambda.Function(this, 'createProduct', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'create-product.createProductHandler',
      code: aws_lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        PRODUCT_TABLE: productTable.tableName,
        STOCK_TABLE: stockTable.tableName,
      },
      layers: [layerStack.sharedLayer],
    });

    productTable.grantWriteData(createProduct);
    stockTable.grantWriteData(createProduct);

    const api = new aws_apigateway.RestApi(this, 'ProductsServiceApi', {
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
  }
}
