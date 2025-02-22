"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsByIdServiceStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class ProductsByIdServiceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const productById = new lambda.Function(this, 'ProductsById', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'products-by-id.handler',
            code: lambda.Code.fromAsset('./src/product_service/handlers'),
        });
        // Define the API Gateway and the /product/proguctId endpoints
        const api = new apigateway.LambdaRestApi(this, 'ProductsByIdServiceAPI', {
            handler: productById,
            proxy: false // Enables setting up individual routes
        });
        const productIdResource = api.root
            .addResource('products')
            .addResource('{productId}');
        const getCorsMethodOptions = () => ({
            methodResponses: [{
                    statusCode: '200',
                    responseParameters: {
                        'method.response.header.Access-Control-Allow-Origin': true,
                    }
                }],
        });
        productIdResource.addMethod('PUT', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        productIdResource.addMethod('POST', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        productIdResource.addMethod('DELETE', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        productIdResource.addMethod('GET', new apigateway.LambdaIntegration(productById), getCorsMethodOptions());
        // Enabling CORS
        const defaultCorsPreflightOptions = {
            allowOrigins: apigateway.Cors.ALL_ORIGINS,
            allowMethods: apigateway.Cors.ALL_METHODS,
        };
        productIdResource.addCorsPreflight(defaultCorsPreflightOptions);
    }
}
exports.ProductsByIdServiceStack = ProductsByIdServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdHMtYnktaWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2R1Y3RzLWJ5LWlkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWdEO0FBRWhELGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFFekQsTUFBYSx3QkFBeUIsU0FBUSxtQkFBSztJQUMvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3hELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sV0FBVyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzFELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLHdCQUF3QjtZQUNqQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUM7U0FDaEUsQ0FBQyxDQUFDO1FBRUgsOERBQThEO1FBQzlELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDckUsT0FBTyxFQUFFLFdBQVc7WUFDcEIsS0FBSyxFQUFFLEtBQUssQ0FBQyx1Q0FBdUM7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsSUFBSTthQUMvQixXQUFXLENBQUMsVUFBVSxDQUFDO2FBQ3ZCLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUU5QixNQUFNLG9CQUFvQixHQUFtQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLGVBQWUsRUFBRSxDQUFDO29CQUNoQixVQUFVLEVBQUUsS0FBSztvQkFDakIsa0JBQWtCLEVBQUU7d0JBQ2xCLG9EQUFvRCxFQUFFLElBQUk7cUJBQzNEO2lCQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUMxRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUMzRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUM3RyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUV4RyxnQkFBZ0I7UUFDaEIsTUFBTSwyQkFBMkIsR0FBRztZQUNsQyxZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ3pDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7U0FDMUMsQ0FBQTtRQUNELGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUNKO0FBekNELDREQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0c0J5SWRTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZHVjdEJ5SWQgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdQcm9kdWN0c0J5SWQnLCB7XHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxyXG4gICAgICAgICAgICBoYW5kbGVyOiAncHJvZHVjdHMtYnktaWQuaGFuZGxlcicsXHJcbiAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9zcmMvcHJvZHVjdF9zZXJ2aWNlL2hhbmRsZXJzJyksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSB0aGUgQVBJIEdhdGV3YXkgYW5kIHRoZSAvcHJvZHVjdC9wcm9ndWN0SWQgZW5kcG9pbnRzXHJcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhUmVzdEFwaSh0aGlzLCAnUHJvZHVjdHNCeUlkU2VydmljZUFQSScsIHtcclxuICAgICAgICAgICAgaGFuZGxlcjogcHJvZHVjdEJ5SWQsXHJcbiAgICAgICAgICAgIHByb3h5OiBmYWxzZSAvLyBFbmFibGVzIHNldHRpbmcgdXAgaW5kaXZpZHVhbCByb3V0ZXNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvZHVjdElkUmVzb3VyY2UgPSBhcGkucm9vdFxyXG4gICAgICAgICAgLmFkZFJlc291cmNlKCdwcm9kdWN0cycpXHJcbiAgICAgICAgICAuYWRkUmVzb3VyY2UoJ3twcm9kdWN0SWR9Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGdldENvcnNNZXRob2RPcHRpb25zOiAoKSA9PiBhcGlnYXRld2F5Lk1ldGhvZE9wdGlvbnMgPSAoKSA9PiAoe1xyXG4gICAgICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcclxuICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfV0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHByb2R1Y3RJZFJlc291cmNlLmFkZE1ldGhvZCgnUFVUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24ocHJvZHVjdEJ5SWQpLCBnZXRDb3JzTWV0aG9kT3B0aW9ucygpKTtcclxuICAgICAgICBwcm9kdWN0SWRSZXNvdXJjZS5hZGRNZXRob2QoJ1BPU1QnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihwcm9kdWN0QnlJZCksIGdldENvcnNNZXRob2RPcHRpb25zKCkpO1xyXG4gICAgICAgIHByb2R1Y3RJZFJlc291cmNlLmFkZE1ldGhvZCgnREVMRVRFJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24ocHJvZHVjdEJ5SWQpLCBnZXRDb3JzTWV0aG9kT3B0aW9ucygpKTtcclxuICAgICAgICBwcm9kdWN0SWRSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHByb2R1Y3RCeUlkKSwgZ2V0Q29yc01ldGhvZE9wdGlvbnMoKSk7XHJcblxyXG4gICAgICAgICAgLy8gRW5hYmxpbmcgQ09SU1xyXG4gICAgICAgICAgY29uc3QgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcclxuICAgICAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBwcm9kdWN0SWRSZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucyk7XHJcbiAgICB9XHJcbn0iXX0=