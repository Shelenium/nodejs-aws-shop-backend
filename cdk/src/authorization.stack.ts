import {
  aws_iam,
  aws_lambda,
  CfnOutput,
  Duration,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LayerStack } from './layer.stack';

export class AuthorizationStack extends Stack {

  constructor(scope: Construct, id: string, layerStack: LayerStack, props: StackProps) {
    super(scope, id, props);

    const AUTH_USERNAME: string = process.env.AUTH_USERNAME || '';
    const AUTH_PASSWORD: string = process.env[AUTH_USERNAME] || '';

    const basicAuthorizerLambda = new aws_lambda.Function(this, 'ArtRssShopBasicAuthorizer', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'basic-authorizer.basicAuthorizerHandler',
      code: aws_lambda.Code.fromAsset('./dist/authorization_service/handlers'),
      environment: {
        AUTH_USERNAME,
        AUTH_PASSWORD,
      },
      memorySize: 128,
      timeout: Duration.seconds(10), 
      layers: [layerStack.sharedLayer],
    });

    
    basicAuthorizerLambda.addPermission('APIGatewayInvokePermission', {
      principal: new aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:${props.env!.region}:${props.env!.account}:*`,
    });

    new CfnOutput(this, 'AuthorizerLambdaArn', {
      value: basicAuthorizerLambda.functionArn,
      exportName: 'BasicAuthorizerLambdaArn',
    });
  }
}
