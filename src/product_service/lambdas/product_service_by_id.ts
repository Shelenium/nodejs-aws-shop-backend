import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class ProductServiceByIdStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const productById = new lambda.Function(this, 'ProductById', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'product-by-id.handler',
            code: lambda.Code.fromAsset('./src/product_service/handlers'),
        });

        // Define the API Gateway and the /product/proguctId endpoints
        const api = new apigateway.LambdaRestApi(this, 'ProductServiceByIdAPI', {
            handler: productById,
            proxy: false // Enables setting up individual routes
        });

        const productResource = api.root.addResource('product');
        const productIdResource = productResource.addResource('{productId}');

        const getCorsMethodOptions: () => apigateway.MethodOptions = () => ({
          methodResponses: [{
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            }
          }],
        });

        productIdResource.addMethod('PUT', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        productIdResource.addMethod('POST', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        productIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        productIdResource.addMethod('GET', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());

          // Enabling CORS
          const defaultCorsPreflightOptions = {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
          }
          productIdResource.addCorsPreflight(defaultCorsPreflightOptions);
    }
}