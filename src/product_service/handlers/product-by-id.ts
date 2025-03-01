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
    "Access-Control-Allow-Origin": "*"
    };

  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product id should be provided" }),
    };
  };

  const productsResult = await dynamoDb.send(new ScanCommand({ TableName: process.env.PRODUCT_TABLE! }));
  const products = productsResult.Items as Product[];
  const stockResult = await dynamoDb.send(new ScanCommand({ TableName: process.env.STOCK_TABLE! }));
  const stocks = stockResult.Items as Stock[];
  const product: Product | undefined = products.find(item => item.id === productId);
  if (!product) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Product not found" }),
    };
  };
  const stock: Stock = stocks.find(item => item.product_id === productId) ?? {} as Stock;
  const uiProduct: UiProductModel = { ...product, count: stock?.count || 0 };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(uiProduct),
  };
};
