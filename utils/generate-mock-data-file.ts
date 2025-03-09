// writeMockToFile.ts

import { generateMockProduct, product_table_size } from './generate-product-mock-data';
import * as fs from 'fs';
import { generateMockData } from './generate-mock-data';
import { Product } from '../product_service/src/models';

export const generateProductsMockData: Product[] = generateMockData(generateMockProduct, product_table_size);
const dataString = `export const productsDataMock = ${JSON.stringify(generateProductsMockData, null, 2)};`;

fs.writeFile('products-data-mock.ts', dataString, (err) => {
  if (err) {
    console.error('Error writing mock data to file:', err);
  } else {
    console.log(`Mock data for products written successfully to products-data-mock.ts`);
  }
});
