import { S3Handler, S3Event } from 'aws-lambda';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import csv from 'csv-parser';
import { Readable } from 'stream';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const csvParser = (csv as any).default || csv;
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

if (!SQS_QUEUE_URL) {
  throw new Error("SQS_QUEUE_URL is not configured in environment variables.");
}

export const fileParserHandler: S3Handler = async (event: S3Event): Promise<void> => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = record.s3.object.key;

    if (!objectKey.startsWith('uploaded/')) {
      console.warn(`Object ${objectKey} is not in the "uploaded/" folder. Skipping.`);
      continue;
    }

    try {
      console.log(`Processing file: s3://${bucketName}/${objectKey}`);
      const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
      const response = await s3Client.send(getObjectCommand);
      const readableStream = response.Body as Readable;

      const sendRecord = async (record: string) => {
        console.log("Sending record to SQS:", record);

        const sendMessageCommand = new SendMessageCommand({
          QueueUrl: SQS_QUEUE_URL,
          MessageBody: JSON.stringify(record),
        });
        await sqsClient.send(sendMessageCommand);
      };

      await new Promise((resolve, reject) => {
        const results: unknown[] = [];
        readableStream
          .pipe(csvParser())
          .on("data", (data: string) => {
            results.push(data);
            try { 
              sendRecord(data);
              console.log(`File ${objectKey} processed successfully.`);
            } catch (error) {
              console.error(`Error sending record to SQS: ${error}`);
            }
          })
          .on("error", (error: unknown) => {
            console.error("Error while parsing CSV:", error);
            reject(error);
          })
          .on("end", () => {
            console.log(`CSV file from ${objectKey} fully parsed and send to SQS.`);
            resolve(results);
          });
      });

      const parsedKey = objectKey.replace('uploaded/', 'parsed/');

      console.log(`Moving file from "uploaded" to "parsed": ${objectKey} -> ${parsedKey}`);

      const copyObjectCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${objectKey}`,
        Key: parsedKey,
      });
      await s3Client.send(copyObjectCommand);

      console.log(`File copied to "parsed/": s3://${bucketName}/${parsedKey}`);

      const deleteObjectCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });
      await s3Client.send(deleteObjectCommand);

      console.log(`File deleted from "uploaded/": s3://${bucketName}/${objectKey}`);

    } catch (error) {
      console.error(`Error processing file s3://${bucketName}/${objectKey}:`, error);
    }
  }
};
