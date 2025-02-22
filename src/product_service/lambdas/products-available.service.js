"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsAvailableServiceStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class ProductsAvailableServiceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const productsAvailableList = new lambda.Function(this, 'ProductsAvailableList', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'products-available-list.handler',
            code: lambda.Code.fromAsset('./src/product_service/handlers'),
        });
        // Define the API Gateway and the /products GET endpoint
        const api = new apigateway.LambdaRestApi(this, 'ProductsAvailableServiceApi', {
            handler: productsAvailableList,
            proxy: false // Enables setting up individual routes
        });
        const availableResource = api.root
            .addResource('products')
            .addResource('available');
        availableResource.addMethod('GET', new apigateway.LambdaIntegration(productsAvailableList), {
            // Set up CORS
            methodResponses: [{
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Origin': true,
                    }
                }],
        });
        // Enabling CORS
        const defaultCorsPreflightOptions = {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
        };
        availableResource.addCorsPreflight(defaultCorsPreflightOptions);
    }
}
exports.ProductsAvailableServiceStack = ProductsAvailableServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMtYXZhaWxhYmxlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9kdWN0cy1hdmFpbGFibGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBZ0Q7QUFFaEQsaURBQWlEO0FBQ2pELHlEQUF5RDtBQUV6RCxNQUFhLDZCQUE4QixTQUFRLG1CQUFLO0lBQ3BELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDeEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQzdFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGlDQUFpQztZQUMxQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBRUgsd0RBQXdEO1FBQ3hELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsNkJBQTZCLEVBQUU7WUFDMUUsT0FBTyxFQUFFLHFCQUFxQjtZQUM5QixLQUFLLEVBQUUsS0FBSyxDQUFDLHVDQUF1QztTQUN2RCxDQUFDLENBQUM7UUFFSCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxJQUFJO2FBQy9CLFdBQVcsQ0FBQyxVQUFVLENBQUM7YUFDdkIsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTVCLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMscUJBQXFCLENBQUMsRUFBRTtZQUN4RixjQUFjO1lBQ2QsZUFBZSxFQUFFLENBQUM7b0JBQ2hCLFVBQVUsRUFBRSxLQUFLO29CQUNqQixrQkFBa0IsRUFBRTt3QkFDbEIsb0RBQW9ELEVBQUUsSUFBSTtxQkFDM0Q7aUJBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixNQUFNLDJCQUEyQixHQUFHO1lBQ2xDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDekMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztTQUMxQyxDQUFBO1FBQ0QsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUN0RSxDQUFDO0NBQ0o7QUFyQ0Qsc0VBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xyXG5cclxuZXhwb3J0IGNsYXNzIFByb2R1Y3RzQXZhaWxhYmxlU2VydmljZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RzQXZhaWxhYmxlTGlzdCA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ1Byb2R1Y3RzQXZhaWxhYmxlTGlzdCcsIHtcclxuICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXHJcbiAgICAgICAgICAgIGhhbmRsZXI6ICdwcm9kdWN0cy1hdmFpbGFibGUtbGlzdC5oYW5kbGVyJyxcclxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCcuL3NyYy9wcm9kdWN0X3NlcnZpY2UvaGFuZGxlcnMnKSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gRGVmaW5lIHRoZSBBUEkgR2F0ZXdheSBhbmQgdGhlIC9wcm9kdWN0cyBHRVQgZW5kcG9pbnRcclxuICAgICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKHRoaXMsICdQcm9kdWN0c0F2YWlsYWJsZVNlcnZpY2VBcGknLCB7XHJcbiAgICAgICAgICAgIGhhbmRsZXI6IHByb2R1Y3RzQXZhaWxhYmxlTGlzdCxcclxuICAgICAgICAgICAgcHJveHk6IGZhbHNlIC8vIEVuYWJsZXMgc2V0dGluZyB1cCBpbmRpdmlkdWFsIHJvdXRlc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBhdmFpbGFibGVSZXNvdXJjZSA9IGFwaS5yb290XHJcbiAgICAgICAgICAuYWRkUmVzb3VyY2UoJ3Byb2R1Y3RzJylcclxuICAgICAgICAgIC5hZGRSZXNvdXJjZSgnYXZhaWxhYmxlJyk7IFxyXG5cclxuICAgICAgICBhdmFpbGFibGVSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHByb2R1Y3RzQXZhaWxhYmxlTGlzdCksIHtcclxuICAgICAgICAgICAgLy8gU2V0IHVwIENPUlNcclxuICAgICAgICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIEVuYWJsaW5nIENPUlNcclxuICAgICAgICAgIGNvbnN0IGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXHJcbiAgICAgICAgICAgIGFsbG93TWV0aG9kczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9NRVRIT0RTLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYXZhaWxhYmxlUmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodChkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnMpO1xyXG4gICAgfVxyXG59Il19