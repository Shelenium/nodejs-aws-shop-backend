import {
  aws_lambda,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LayerStack } from './layer.stack';

export class AuthorizationStack extends Stack {
  constructor(scope: Construct, id: string, layerStack: LayerStack, props?: StackProps) {
    super(scope, id, props);

    const PASSWORD: string = process.env.Shelenium || '';

    const basicAuthorizerLambda = new aws_lambda.Function(this, 'ArtRssShopBasicAuthorizer', {
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      handler: 'basic-auhorizer.basicAuthorizerHandler',
      code: aws_lambda.Code.fromAsset('./dist/authorization_service/handlers'),
      memorySize: 512,
      environment: {
        PASSWORD,
      },
      layers: [layerStack.sharedLayer],
    });
  }
}
