require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { productsDataMock } =  require('./dist/product_service/mocks/products-data-mock.js');

const docClient = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: process.env.AWS_REGION })
);

async function populateTable() {
    const stockDataMock = productsDataMock.map((item) => ({
        product_id: item.id,
        count: Math.floor(Math.random() * 100) + 1,
    }));
    try {
        for (const item of stockDataMock) {
            const params = {
                TableName: process.env.STOCK_TABLE,
                Item: item,
            };
            await docClient.send(new PutCommand(params));
            console.log(`Item inserted: ${item.id}`);
        }
        console.log('All items inserted successfully.');
    } catch (err) {
        console.error("Error inserting items:", err);
    }
}

populateTable();
