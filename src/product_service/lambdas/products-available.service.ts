import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ProductsAvailableServiceStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const productsAvailableList = new lambda.Function(this, 'ProductsAvailableList', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'products-available-list.handler',
            code: lambda.Code.fromAsset('./src/product_service/handlers'),
        });

        // Define the API Gateway and the /products GET endpoint
        const api = new apigateway.LambdaRestApi(this, 'ProductsAvailableServiceApi', {
            handler: productsAvailableList,
            proxy: false // Enables setting up individual routes
        });

        const availableResource = api.root
          .addResource('products')
          .addResource('available'); 

        availableResource.addMethod('GET', new apigateway.LambdaIntegration(productsAvailableList), {
            // Set up CORS
            methodResponses: [{
              statusCode: '200',
              responseParameters: {
                'method.response.header.Access-Control-Allow-Origin': true,
              }
            }],
          });
          
          // Enabling CORS
          const defaultCorsPreflightOptions = {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
          }
          availableResource.addCorsPreflight(defaultCorsPreflightOptions);
    }
}