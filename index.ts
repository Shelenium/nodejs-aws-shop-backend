#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsByIdServiceStack, ProductsAvailableServiceStack } from './src/product_service';

const app = new cdk.App();
new ProductsAvailableServiceStack(app, 'ProductsAvailableServiceStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-west-1" },
});
new ProductsByIdServiceStack(app, 'ProductsByIdServiceStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-west-1" },
});