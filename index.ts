#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { GetProductServiceStack, ProductServiceByIdStack } from './src/product_service';

const app = new cdk.App();
new GetProductServiceStack(app, 'GetProductServiceStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-west-1" },
});
new ProductServiceByIdStack(app, 'ProductServiceByIdStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-west-1" },
});