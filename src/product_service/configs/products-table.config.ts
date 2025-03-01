import { DbTableAccessModel } from '../models';

const generalDbConfig: DbTableAccessModel = {
  region: process.env.AWS_REGION,
};

export const productTableConfig: DbTableAccessModel = {
  tableName: process.env.PRODUCT_TABLE,
...generalDbConfig,
};

export const stockTableConfig: DbTableAccessModel = {
  tableName: process.env.STOCK_TABLE,
...generalDbConfig,
};
