#!/usr/bin/env node
import 'dotenv/config';
import 'source-map-support/register';
import { ProductsStack } from './products.stack';
import { ImportStack } from './import.stack';
import { App } from 'aws-cdk-lib';
import { LayerStack } from './layer.stack';

const app = new App();

const layerStack = new LayerStack(app, 'LayerStack');

new ProductsStack(app, 'ProductsServiceStack', layerStack, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});

new ImportStack(app, 'ImportServiceStack', layerStack, {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});
