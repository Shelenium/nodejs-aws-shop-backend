import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocumentClient, TransactWriteCommand, TransactWriteCommandInput, TransactWriteCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UiProductModel } from '../models/ui-product.model';
import { marshall } from "@aws-sdk/util-dynamodb";
import { generateUUID } from './uuid.helper';

const headers = { 
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET, POST",
  "Access-Control-Allow-Origin": "*",
};

const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const uiProduct: UiProductModel | undefined | null = JSON.parse(event.body);
  if (!uiProduct) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product data should be provided" }),
    };
  };
  console.log('Body input uiProduct: ', uiProduct);

  if (typeof(uiProduct.count) !== 'number' || uiProduct.count < 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product input data is not valid. Count should be a positive number" }),
    };
  }

  if (uiProduct.price !== undefined && (isNaN(Number(uiProduct.price)) || Number(uiProduct.price) <= 0)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product input data is not valid. Price should represent a positive number" }),
    };
  }

  if (!uiProduct.title) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product input data is not valid. Title should be provided"}),
    };
  }

  const productId = generateUUID();
  const productParams = {
    TableName: process.env.PRODUCT_TABLE!,
    Item: {
      id: productId,
      title: uiProduct.title,
      description: uiProduct.description || '',
      price: uiProduct.price ? Number(uiProduct.price) : 0,
    },
  };

  const stockParams = {
    TableName: process.env.STOCK_TABLE!,
    Item: {
      product_id: productId,
      count: uiProduct.count,
    },
  };

  const transactionParams: TransactWriteCommandInput = {
    TransactItems: [
      {
        Put: productParams,
      },
      {
        Put: stockParams,
      },
    ],
  };

  try {
    const result: TransactWriteCommandOutput = await dynamoDb.send(new TransactWriteCommand(transactionParams));
    console.log('Product creation successed: ', result);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Product creation successed!' }),
    };
} catch (dbError) {
    console.error('Product Error:', dbError);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Product creation failed',
        errorMessage: dbError,
      }),
    };
  }
}
