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

  const sendProduct = async (product: Product) => {
    const { id, title, price, description } = product;
    console.log("Sending Product to DynamoDB:", product);

    const productItem: PutItemCommandInput = {
      TableName: tableName,
      Item: {
        id: { S: id },
        title: { S: title },
        price: { N: price.toString() }, // DynamoDB uses strings for numbers
        description: { S: description },
      },
    };
    console.log("Product Item:", JSON.stringify(productItem, null, 2));
    const putItemCommand = new PutItemCommand(productItem);
    await dynamoDbClient.send(putItemCommand);
  };

  const handleSendProduct = async (product: Product) => {
    try {
      console.log("Sending product:", product);
      await sendProduct(product);
      succeedProducts.push(product);
      console.log(`Product ${product.id}: ${product.title} added to DynamoDB ${tableName}`);
    } catch (error) {
      failedProducts.push(product);
      console.error("Error adding product to DynamoDB:", error, "Record ID:", product.id);
    }
  }

  const processCreatedProducts = async () => {
    for (const product of createdProducts) {
      await handleSendProduct(product);
    }
  };

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

  const handleNotification = async (notification: PublishCommandInput) => {
    try {
      const result = await sendNotification(notification);
      console.log('Notification sent to SNS topic:', snsTopicArn, result);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  const processSuccessNotifications = async () => {
    for (const product of succeedProducts) {
      const notification: PublishCommandInput = getSuccessNotification(product);
      await handleNotification(notification);
    }
  };

  const processFailedNotifications = async () => {
    for (const product of failedProducts) {
      const notification: PublishCommandInput = getFailedNotification(product);
      await handleNotification(notification);
    }
  };

  processCreatedProducts();
  processSuccessNotifications();
  processFailedNotifications();
};
