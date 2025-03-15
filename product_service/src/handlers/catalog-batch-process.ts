import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { Product } from '../models';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

export const catalogBatchProcessHandler: SQSHandler = async (event: SQSEvent) => {
  console.log('Received SQS Event:', JSON.stringify(event, null, 2));

  const tableName = process.env.PRODUCT_TABLE;
  const snsTopicArn = process.env.SNS_TOPIC_ARN;

  if (!tableName) {
    throw new Error("Missing PRODUCT_TABLE environment variable.");
  }

  if (!snsTopicArn) {
    throw new Error("Missing SNS_TOPIC_ARN environment variable.");
  }

  const createdProducts: Product[] = [];
  const succeedProducts: Product[] = [];
  const failedProducts: Product[] = [];

  for (const record of event.Records) {
    const messageBody: Product = JSON.parse(record.body) as Product;
    console.log("Processing Message:", messageBody);
    if (createdProducts.find(product => product.id === messageBody.id)) {
      failedProducts.push(messageBody);
      throw new Error(`Duplicated product ID: ${messageBody.id}`);
    } else {
      createdProducts.push(messageBody);
    }
  }

  createdProducts.forEach((product: Product) => {
    const { id, title, price, description } = product;
    console.log("Sending Product to DynamoDB:", product);

    const sendProduct = async () => {
      const productItem: PutItemCommandInput = {
        TableName: tableName,
        Item: {
          id: { S: id },
          title: { S: title },
          price: { N: price.toString() }, // DynamoDB uses strings for numbers
          description: { S: description },
        },
      };

      const putItemCommand = new PutItemCommand(productItem);
      await dynamoDbClient.send(putItemCommand);
    };

    try {
      sendProduct();
      succeedProducts.push(product);
      console.log(`Product ${id}: ${title} added to DynamoDB ${tableName}`);
    } catch (error) {
      failedProducts.push(product);
      console.error("Error adding product to DynamoDB:", error, "Record ID:", id);
    }
  });

  const getSuccessNotification = (product: Product): PublishCommandInput => {
    const messageAttributes = {
      price: {
        DataType: 'Number',
        StringValue: product.price.toString(),
      },
    };
    
    return ({
      Subject:`'New Product ${product.id}: ${product.title} Created`,
      Message: JSON.stringify({
        message: `The following product have been successfully created:`,
        product,
      }),
      TopicArn: snsTopicArn,
      MessageAttributes: messageAttributes,
    });
  }

  const getFailedNotification = (product: Product): PublishCommandInput => {
    const messageAttributes = {
      failedUpload: {
        DataType: 'String',
        StringValue: JSON.stringify(product.id),
      },
    };
    
    return ({
      Subject:`'Product ${product.id}: ${product.title} creation failed`,
      Message: JSON.stringify({
        message: `The following product creation failed:`,
        product,
      }),
      TopicArn: snsTopicArn,
      MessageAttributes: messageAttributes,
    });
  }

  const sendNotification = async (notification: PublishCommandInput) => {
    const publishCommand = new PublishCommand(notification);
    await snsClient.send(publishCommand);
  }

  const handleNotification = (notification: PublishCommandInput) => {
    try {
      sendNotification(notification);
      console.log('Notification sent to SNS topic:', snsTopicArn);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  succeedProducts.forEach((product: Product) => {
    const notification: PublishCommandInput = getSuccessNotification(product);
    handleNotification(notification);
  });

  failedProducts.forEach((product: Product) => {
    const notification: PublishCommandInput = getFailedNotification(product);
    handleNotification(notification);
  });
};
