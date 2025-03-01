import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Product } from '../models';

const productsMock: Product[] = [
    { id: "1", title: "Product 1", description: "Description 1", price: 100 },
    { id: "2", title: "Product 2", description: "Description 2", price: 200 },
    { id: "3", title: "Product 3", description: "Description 3", price: 300 }
];

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = { 
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Origin": "*",
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(productsMock),
  };
};
