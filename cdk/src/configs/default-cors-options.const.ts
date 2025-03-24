import { aws_apigateway } from 'aws-cdk-lib';

export const defaultCorsPreflightOptions: aws_apigateway.CorsOptions = {
  allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
  allowMethods: aws_apigateway.Cors.ALL_METHODS,
};

export const getCorsMethodOptions: () => aws_apigateway.MethodOptions = () => ({
  methodResponses: [{
    statusCode: '200',
    responseParameters: {
      'method.response.header.Access-Control-Allow-Origin': true,
    }
  }],
});

export const authorizationHeaders = {
  "Access-Control-Allow-Origin": "'*'",
  "Access-Control-Allow-Headers": "'Content-Type, Authorization'",
  "Access-Control-Allow-Methods": "'GET, PUT, OPTIONS'",
};
