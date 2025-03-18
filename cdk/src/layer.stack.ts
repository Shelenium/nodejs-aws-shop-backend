import { App, aws_lambda, aws_sqs, Duration, Stack, StackProps } from 'aws-cdk-lib';

export class LayerStack extends Stack {
  readonly sharedLayer: aws_lambda.LayerVersion;
  readonly catalogItemsQueue: aws_sqs.Queue;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.sharedLayer = new aws_lambda.LayerVersion(this, 'artRssShopSharedLayer', {
      code: aws_lambda.Code.fromAsset('./dist/layer.zip'),
      compatibleRuntimes: [aws_lambda.Runtime.NODEJS_20_X],
      description: 'Layer for shared code and libraries.',
    });

    const sqsQueueName: string = process.env.SQS_QUEUE_NAME || 'ArtRssShopCatalogItemsQueue';

    this.catalogItemsQueue = new aws_sqs.Queue(this, sqsQueueName, {
      queueName: sqsQueueName,
      visibilityTimeout: Duration.seconds(80),
      receiveMessageWaitTime: Duration.seconds(10),
    });
  }
}
