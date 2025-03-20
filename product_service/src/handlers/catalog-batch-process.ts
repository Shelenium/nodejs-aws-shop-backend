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

  const createdProducts: string[] = [];
  const failedProducts: string[] = [];

  const handleInput = (messageBody: UiProductModel): UiProductModel | null  => {
    switch(true) {
      case (createdProducts.includes(messageBody.title) || failedProducts.includes(messageBody.title)):
        console.log(`Duplicated product: ${messageBody.title}`);
        return null;
      case (messageBody.count < 0 || isNaN(Number(messageBody.count))):
        console.log(`Invalid product count: ${messageBody.title} ${messageBody.count}`);
        return null;
      case (!messageBody.title):
        console.log(`Invalid product: ${messageBody.title}`);
        return null;
      case (messageBody.price < 0 || isNaN(Number(messageBody.price))):
        console.log(`Invalid product price: ${messageBody.title} ${messageBody.price}`);
        return null;
      default:
        return ({
          ...messageBody,
          count: Number(messageBody.count),
          price: Number(messageBody.price),
        });
    };
  }

  const sendProductLambda = async (product: UiProductModel) => {

    const payload = JSON.stringify({
      body: JSON.stringify(product),
    });

    const command = new InvokeCommand({
      FunctionName: createProductLambdaName,
      Payload: Buffer.from(payload),
    });

    const response = await lambdaClient.send(command);
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
      failedProducts.push(product.title);
    }
  }

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

  const getFailedNotification = (title: string): PublishCommandInput => {
    const messageAttributes = {
      failedUpload: {
        DataType: 'String',
        StringValue: title,
      },
    };
    
    return ({
      Subject: `Product ${title} creation failed`,
      Message: JSON.stringify({
        message: `The following product creation failed:`,
        title,
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
      await sendNotification(notification);
      console.log('Notification sent to SNS topic:', snsTopicArn);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  const processFailedNotifications = async () => {
    for (const title of failedProducts) {
      const notification: PublishCommandInput = getFailedNotification(title);
      await handleNotification(notification);
    }
  };

  for (const record of event.Records) {
    console.log('Processing record:', record);
    const messageBody: UiProductModel = JSON.parse(record.body) as UiProductModel;
    const product: UiProductModel | null = handleInput(messageBody);
    if (product) {
      await handleSendProductLambda(product);
      const notification: PublishCommandInput = getSuccessNotification(product);
      await handleNotification(notification);
      createdProducts.push(messageBody.title);
    } else {
      failedProducts.push(messageBody.title);
    }
  }

  processFailedNotifications();
};
