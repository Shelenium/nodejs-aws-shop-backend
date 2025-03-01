import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product, Stock } from '../models';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UiProductModel } from '../models/ui-product.model';

const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const productsResult = await dynamoDb.send(new ScanCommand({ TableName: process.env.PRODUCT_TABLE! }));
    const products = productsResult.Items as Product[];

    const stockResult = await dynamoDb.send(new ScanCommand({ TableName: process.env.STOCK_TABLE! }));
    const stocks = stockResult.Items as Stock[];

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
