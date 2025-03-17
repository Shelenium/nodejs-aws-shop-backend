import { SQSEvent, SQSHandler } from 'aws-lambda';
import { Product, UiProductModel } from '../models';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";


const snsClient = new SNSClient({ region: process.env.AWS_REGION });
const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

export const catalogBatchProcessHandler: SQSHandler = async (event: SQSEvent) => {
  console.log('Received SQS Event:', JSON.stringify(event, null, 2));

  const snsTopicArn = process.env.SNS_TOPIC_ARN;
  const createProductLambdaName = process.env.CREATE_PRODUCT_NAME;

  if (!snsTopicArn) {
    throw new Error("Missing SNS_TOPIC_ARN environment variable.");
  }

  if (!createProductLambdaName) {
    throw new Error("Missing CREATE_PRODUCT_NAME environment variable.");
  }

  const createdProducts: UiProductModel[] = [];
  const succeedProducts: UiProductModel[] = [];
  const failedProducts: UiProductModel[] = [];

  for (const record of event.Records) {
    const messageBody: UiProductModel = JSON.parse(record.body) as UiProductModel;

    console.log("Processing Message:", messageBody);
    if (createdProducts.find(product => product.title === messageBody.title)) {
      failedProducts.push(messageBody);
      console.log(`Duplicated product: ${messageBody.title}`);
    } else if (messageBody.count < 0 || isNaN(Number(messageBody.count))) {
      failedProducts.push(messageBody);
      console.log(`Invalid product count: ${messageBody.title} ${messageBody.count}`);
    } else if (!messageBody.title) {
      failedProducts.push(messageBody);
      console.log(`Invalid product: ${messageBody.title}`);
    } else if (messageBody.price < 0 || isNaN(Number(messageBody.price))) {
      failedProducts.push(messageBody);
      console.log(`Invalid product price: ${messageBody.title} ${messageBody.price}`);
    } else {
      createdProducts.push({
        ...messageBody,
        count: Number(messageBody.count),
        price: Number(messageBody.price),
      });
    }
  }

  const sendProductLambda = async (product: UiProductModel) => {

    const payload = JSON.stringify({
      body: JSON.stringify(product),
    });

    const command = new InvokeCommand({
      FunctionName: createProductLambdaName,
      Payload: Buffer.from(payload),
    });

    console.log(`${createProductLambdaName} Lambda Payload: `, payload);

    const response = await lambdaClient.send(command);

    console.log(`${createProductLambdaName} Lambda Response:`, response);

    const responsePayload = JSON.parse(new TextDecoder("utf-8").decode(response.Payload));
    console.log("Decoded Response Payload:", responsePayload);
    return responsePayload;
  };

  const handleSendProductLambda = async (product: UiProductModel) => {
    try {
      await sendProductLambda(product);
      console.log(`Create Item Lambda for ${product.title} invoked successfully`);
    } catch (error) {
      console.error(`Error invoking PutItem Lambda for ${product.title} :`, error);
      failedProducts.push(product);
    }
  }

  const processCreatedProducts = async () => {
    for (const product of createdProducts) {
      await handleSendProductLambda(product);
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
      Subject: `New Product ${product.id}: ${product.title} Created`,
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
      Subject: `Product ${product.id}: ${product.title} creation failed`,
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
