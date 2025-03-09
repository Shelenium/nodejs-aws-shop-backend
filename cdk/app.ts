#!/usr/bin/env node
import 'dotenv/config';
import 'source-map-support/register';
import { ProductsStack, ImportStack, LayerStack } from './src';
import { App } from 'aws-cdk-lib';

const app = new App();

const layerStack = new LayerStack(app, 'LayerStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});

new ProductsStack(app, 'ProductsServiceStack', layerStack, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});

new ImportStack(app, 'ImportServiceStack', layerStack, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});
