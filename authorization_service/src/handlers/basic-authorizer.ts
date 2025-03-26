import { APIGatewayAuthorizerResult, APIGatewayAuthorizerEvent, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const headers = { 
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Credentials': true,
};

function generatePolicy(principalId: string, effect: 'Allow' | 'Deny', resource: string): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export const basicAuthorizerHandler = async (event: APIGatewayAuthorizerEvent): Promise<
  APIGatewayAuthorizerResult | { statusCode: number; headers: Record<string, string | boolean>, body: string }> => {
  try {
    console.log('Authorization event:', event);

    // Extract Authorization header
    const authorizationHeader = (event as APIGatewayTokenAuthorizerEvent).authorizationToken;
    if (!authorizationHeader) {
      console.log('Missing Authorization header: ', event);
      return ({
        ...generatePolicy('unauthorized-user', 'Deny', event.methodArn),
          context: {
            errorType: "UNAUTHORIZED",
            errorMessage: "Missing token",
            statusCode: 401,
          },
        });
    }

    const decodedToken = Buffer.from(authorizationHeader, 'base64').toString('utf-8');
    const [username, password] = decodedToken.split(':'); // Parse `username:password`

    if (!username || !password) {
      console.log('Invalid token format: ', decodedToken);
      return ({
        ...generatePolicy('unauthorized-user', 'Deny', event.methodArn),
          context: {
            errorType: "UNAUTHORIZED",
            errorMessage: "Invalid token format",
            statusCode: 401,
          },
        });
    }

    const validUsername = process.env.AUTH_USERNAME || 'admin';
    const validPassword = process.env.AUTH_PASSWORD || 'password123';

    if (username !== validUsername || password !== validPassword) {
      console.log('Invalid credentials: ', validUsername, validPassword);
      return ({
        ...generatePolicy('unauthorized-user', 'Deny', event.methodArn),
          context: {
            errorType: "FORBIDDEN",
            errorMessage: "Token is not authorized to access this resource",
            statusCode: 403,
          },
        });
    }

    return generatePolicy(username, 'Allow', event.methodArn);

  } catch (error) {
    console.error('Error validating Authorization:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
