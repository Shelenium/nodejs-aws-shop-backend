import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { defaultCorsPreflightOptions, getCorsMethodOptions } from '../configs';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';

export class ProductsServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const productTable: ITable = Table.fromTableName(this, 'ProductTable', process.env.PRODUCT_TABLE ?? '');
    const stockTable: ITable = Table.fromTableName(this, 'StockTable', process.env.STOCK_TABLE ?? '');

    const productsList: lambda.Function = new lambda.Function(this, 'ProductsList', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'products-list.handler',
      code: lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        PRODUCT_TABLE: productTable.tableName,
        STOCK_TABLE: stockTable.tableName,
      },
    });
    productTable.grantReadData(productsList);
    stockTable.grantReadData(productsList);

    const productById: lambda.Function = new lambda.Function(this, 'ProductById', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'product-by-id.handler',
      code: lambda.Code.fromAsset('./dist/product_service/handlers'),
      environment: {
        PRODUCT_TABLE: productTable.tableName,
        STOCK_TABLE: stockTable.tableName,
      },
    });

    productTable.grantReadData(productById);
    stockTable.grantReadData(productById);

    const api = new apigateway.RestApi(this, 'ProductsServiceApi', {
      restApiName: 'Products Service API',
        defaultCorsPreflightOptions,
    });

    const productsResource = api.root.addResource('products');
    const productIdResource = productsResource.addResource('{productId}');

    productsResource.addMethod('GET', new apigateway.LambdaIntegration(productsList), getCorsMethodOptions());

    productIdResource.addMethod('PUT', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
    productIdResource.addMethod('POST', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
    productIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
    productIdResource.addMethod('GET', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
  }
}