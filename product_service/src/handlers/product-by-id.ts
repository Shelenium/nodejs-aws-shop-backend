import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product, Stock } from '../models';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UiProductModel } from '../models/ui-product.model';
import { databaseConnectionError, missingDataError } from './data-errors.handler';

const headers = { 
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
};

const dynamoDb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION })
);

export const productByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters?.productId;
  if (!productId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: "Product id should be provided" }),
    };
  };
  console.log('productId: ', productId);

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
  const product: Product | undefined = products.find(item => item.id === productId);
  console.log('product: ', product);
  if (!product) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Product with id = `${productId}` not found" }),
    };
  };
  const stock: Stock = stocks.find(item => item.product_id === productId) ?? {} as Stock;
  if (!stock) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Stock with id = `${productId}` not found" }),
    };
  };
  const uiProduct: UiProductModel = { ...product, count: stock?.count || 0 };
  console.log('stock: ', stock);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(uiProduct),
  };
};
