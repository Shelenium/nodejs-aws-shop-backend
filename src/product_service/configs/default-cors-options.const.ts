import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export const defaultCorsPreflightOptions: apigateway.CorsOptions = {
  allowOrigins: apigateway.Cors.ALL_ORIGINS,
  allowMethods: apigateway.Cors.ALL_METHODS,
};

export const getCorsMethodOptions: () => apigateway.MethodOptions = () => ({
  methodResponses: [{
    statusCode: '200',
    responseParameters: {
      'method.response.header.Access-Control-Allow-Origin': true,
    }
  }],
});
