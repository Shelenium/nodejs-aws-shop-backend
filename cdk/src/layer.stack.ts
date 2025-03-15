import { App, aws_lambda, Stack, StackProps } from 'aws-cdk-lib';

export class LayerStack extends Stack {
  public readonly sharedLayer: aws_lambda.LayerVersion;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.sharedLayer = new aws_lambda.LayerVersion(this, 'SharedLayer', {
      code: aws_lambda.Code.fromAsset('./dist/layer.zip'),
      compatibleRuntimes: [aws_lambda.Runtime.NODEJS_20_X],
      description: 'Layer for shared code and libraries.',
    });
  }
}
