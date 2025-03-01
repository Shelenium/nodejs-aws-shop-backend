#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsServiceStack } from './product_service';

const app = new cdk.App();
new ProductsServiceStack(app, 'ProductsServiceStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "eu-west-1" },
});
