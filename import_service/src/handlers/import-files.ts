import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { missingBucketError, missingNameError } from './data-errors.handler';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const headers = { 
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': true,
};

export const importFilesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event));

  const bucketName = process.env.BUCKET_NAME;

  if (!bucketName) {
    return missingBucketError;
}

  const fileName = event.queryStringParameters?.name;

  if (!fileName) {
    return missingNameError;
  }

  const generateSignedPutUrl = async (bucketName: string, objectKey: string, expiresIn: number = 3600): Promise<string> => {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  };

  const importResult = generateSignedPutUrl(bucketName, `uploaded/${fileName}`)
    .then(signedUrl => {
      console.error('Upload succeed:', JSON.stringify(signedUrl));
      return {
        statusCode: 200,
        headers,
        body: signedUrl,
      };
    })
    .catch((error) => {
      console.error('Error generating signed URL:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: 'Could not generate signed URL',
          error,
        }),
      };
    });

    return importResult;
};
