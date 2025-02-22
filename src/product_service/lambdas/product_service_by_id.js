"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServiceByIdStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class ProductServiceByIdStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const productById = new lambda.Function(this, 'ProductById', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'product-by-id.handler',
            code: lambda.Code.fromAsset('./src/product_service/handlers'),
        });
        // Define the API Gateway and the /product/proguctId endpoints
        const api = new apigateway.LambdaRestApi(this, 'ProductServiceByIdAPI', {
            handler: productById,
            proxy: false // Enables setting up individual routes
        });
        const productResource = api.root.addResource('product');
        const productIdResource = productResource.addResource('{productId}');
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
exports.ProductServiceByIdStack = ProductServiceByIdStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdF9zZXJ2aWNlX2J5X2lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvZHVjdF9zZXJ2aWNlX2J5X2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCxpREFBaUQ7QUFDakQseURBQXlEO0FBRXpELE1BQWEsdUJBQXdCLFNBQVEsbUJBQUs7SUFDOUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUN4RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN6RCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDO1NBQ2hFLENBQUMsQ0FBQztRQUVILDhEQUE4RDtRQUM5RCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQ3BFLE9BQU8sRUFBRSxXQUFXO1lBQ3BCLEtBQUssRUFBRSxLQUFLLENBQUMsdUNBQXVDO1NBQ3ZELENBQUMsQ0FBQztRQUVILE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVyRSxNQUFNLG9CQUFvQixHQUFtQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLGVBQWUsRUFBRSxDQUFDO29CQUNoQixVQUFVLEVBQUUsS0FBSztvQkFDakIsa0JBQWtCLEVBQUU7d0JBQ2xCLG9EQUFvRCxFQUFFLElBQUk7cUJBQzNEO2lCQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUMxRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUMzRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUM3RyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQztRQUV4RyxnQkFBZ0I7UUFDaEIsTUFBTSwyQkFBMkIsR0FBRztZQUNsQyxZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ3pDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7U0FDMUMsQ0FBQTtRQUNELGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUNKO0FBeENELDBEQXdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcclxuXHJcbmV4cG9ydCBjbGFzcyBQcm9kdWN0U2VydmljZUJ5SWRTdGFjayBleHRlbmRzIFN0YWNrIHtcclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0QnlJZCA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ1Byb2R1Y3RCeUlkJywge1xyXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcclxuICAgICAgICAgICAgaGFuZGxlcjogJ3Byb2R1Y3QtYnktaWQuaGFuZGxlcicsXHJcbiAgICAgICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnLi9zcmMvcHJvZHVjdF9zZXJ2aWNlL2hhbmRsZXJzJyksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSB0aGUgQVBJIEdhdGV3YXkgYW5kIHRoZSAvcHJvZHVjdC9wcm9ndWN0SWQgZW5kcG9pbnRzXHJcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhUmVzdEFwaSh0aGlzLCAnUHJvZHVjdFNlcnZpY2VCeUlkQVBJJywge1xyXG4gICAgICAgICAgICBoYW5kbGVyOiBwcm9kdWN0QnlJZCxcclxuICAgICAgICAgICAgcHJveHk6IGZhbHNlIC8vIEVuYWJsZXMgc2V0dGluZyB1cCBpbmRpdmlkdWFsIHJvdXRlc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0UmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncHJvZHVjdCcpO1xyXG4gICAgICAgIGNvbnN0IHByb2R1Y3RJZFJlc291cmNlID0gcHJvZHVjdFJlc291cmNlLmFkZFJlc291cmNlKCd7cHJvZHVjdElkfScpO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRDb3JzTWV0aG9kT3B0aW9uczogKCkgPT4gYXBpZ2F0ZXdheS5NZXRob2RPcHRpb25zID0gKCkgPT4gKHtcclxuICAgICAgICAgIG1ldGhvZFJlc3BvbnNlczogW3tcclxuICAgICAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwcm9kdWN0SWRSZXNvdXJjZS5hZGRNZXRob2QoJ1BVVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHByb2R1Y3RCeUlkKSwgZ2V0Q29yc01ldGhvZE9wdGlvbnMoKSk7XHJcbiAgICAgICAgcHJvZHVjdElkUmVzb3VyY2UuYWRkTWV0aG9kKCdQT1NUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24ocHJvZHVjdEJ5SWQpLCBnZXRDb3JzTWV0aG9kT3B0aW9ucygpKTtcclxuICAgICAgICBwcm9kdWN0SWRSZXNvdXJjZS5hZGRNZXRob2QoJ0RFTEVURScsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKHByb2R1Y3RCeUlkKSwgZ2V0Q29yc01ldGhvZE9wdGlvbnMoKSk7XHJcbiAgICAgICAgcHJvZHVjdElkUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihwcm9kdWN0QnlJZCksIGdldENvcnNNZXRob2RPcHRpb25zKCkpO1xyXG5cclxuICAgICAgICAgIC8vIEVuYWJsaW5nIENPUlNcclxuICAgICAgICAgIGNvbnN0IGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXHJcbiAgICAgICAgICAgIGFsbG93TWV0aG9kczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9NRVRIT0RTLFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcHJvZHVjdElkUmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodChkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnMpO1xyXG4gICAgfVxyXG59Il19