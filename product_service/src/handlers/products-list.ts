import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product, Stock, UiProductModel } from '../models';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { databaseConnectionError, missingDataError } from './data-errors.handler';

const headers = { 
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
};

const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

export const productsListHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const productsResult = await dynamoDb.send(new ScanCommand({ TableName: process.env.PRODUCT_TABLE! }));
      if (!productsResult) {
        return databaseConnectionError;
      };
    const products = productsResult.Items as Product[];
    if (!products) {
      return missingDataError;
    };

    const stockResult = await dynamoDb.send(new ScanCommand({ TableName: process.env.STOCK_TABLE! }));
    if (!stockResult) {
      return databaseConnectionError;
    };
    const stocks = stockResult.Items as Stock[];
    if (!stocks) {
      return missingDataError;
    };

    const uiProducts: UiProductModel[] = products.map(product => ({
      ...product,
      count: stocks.find(stock => stock.product_id === product.id)?.count || 0,
    }));
    return ({
      statusCode: 200,
      headers,
      body: JSON.stringify(uiProducts),
  });
} catch (error) {
    console.error("Failed to retrieve data:", error);
    return ({
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: "Failed to get products", details: error }),
    });
  }
};
