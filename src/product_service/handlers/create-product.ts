import { APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
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

  if (!uiProduct.title) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product data is not valid" }),
    };
  }
  const productId = generateUUID();
  const productParams = {
    TableName: process.env.PRODUCT_TABLE!,
    Item: marshall({
      id: productId,
      title: uiProduct.title,
      description: uiProduct.description || '',
      price: uiProduct.price ? Number(uiProduct.price) : 0,
    })
  };

  const stockParams = {
    TableName: process.env.STOCK_TABLE!,
    Item: marshall({
      product_id: productId,
      count: uiProduct.count ? Number(uiProduct.count) : 0,
    })
  };

  try {
    await dynamoDb.send(new PutItemCommand(productParams));
    try {
      await dynamoDb.send(new PutItemCommand(stockParams));
    } catch (dbError) {
      console.error('Stock Error:', dbError);
      return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            message: 'Product creation failed: failed to create stock for product',
            errorMessage: dbError,
          })
      };
    }
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
