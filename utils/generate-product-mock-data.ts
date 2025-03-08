// generateMockData.ts

import { v4 as uuidv4 } from 'uuid';
import { Product } from '../product_service/models';
import { generateCustomString } from './generate-custom-string';

export const product_table_size = 25;

export const generateMockProduct = (): Product => ({
  id: uuidv4(),
  title: generateCustomString(10),
  description: generateCustomString(20),
  price: Math.floor(Math.random() * 100) + 1,
});
