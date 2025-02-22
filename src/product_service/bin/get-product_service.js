"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProductServiceStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class GetProductServiceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const getProductsList = new lambda.Function(this, 'GetProductsList', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'get-products-list.handler',
            code: lambda.Code.fromAsset('./src/product_service/lambdas'),
        });
        // Define the API Gateway and the /products GET endpoint
        const api = new apigateway.LambdaRestApi(this, 'ProductServiceApi', {
            handler: getProductsList,
            proxy: false // Enables setting up individual routes
        });
        const productResource = api.root.addResource('product');
        const availableResource = productResource.addResource('available');
        availableResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsList), {
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
exports.GetProductServiceStack = GetProductServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXByb2R1Y3Rfc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldC1wcm9kdWN0X3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWdEO0FBRWhELGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFFekQsTUFBYSxzQkFBdUIsU0FBUSxtQkFBSztJQUM3QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3hELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sZUFBZSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDakUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsMkJBQTJCO1lBQ3BDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQztTQUMvRCxDQUFDLENBQUM7UUFFSCx3REFBd0Q7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNoRSxPQUFPLEVBQUUsZUFBZTtZQUN4QixLQUFLLEVBQUUsS0FBSyxDQUFDLHVDQUF1QztTQUN2RCxDQUFDLENBQUM7UUFFSCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RCxNQUFNLGlCQUFpQixHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFBRTtZQUNsRixjQUFjO1lBQ2QsZUFBZSxFQUFFLENBQUM7b0JBQ2hCLFVBQVUsRUFBRSxLQUFLO29CQUNqQixrQkFBa0IsRUFBRTt3QkFDbEIsb0RBQW9ELEVBQUUsSUFBSTtxQkFDM0Q7aUJBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixNQUFNLDJCQUEyQixHQUFHO1lBQ2xDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDekMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztTQUMxQyxDQUFBO1FBQ0QsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUN0RSxDQUFDO0NBQ0o7QUFwQ0Qsd0RBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdldFByb2R1Y3RTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2V0UHJvZHVjdHNMaXN0ID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnR2V0UHJvZHVjdHNMaXN0Jywge1xyXG4gICAgICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcclxuICAgICAgICAgICAgaGFuZGxlcjogJ2dldC1wcm9kdWN0cy1saXN0LmhhbmRsZXInLFxyXG4gICAgICAgICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJy4vc3JjL3Byb2R1Y3Rfc2VydmljZS9sYW1iZGFzJyksXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSB0aGUgQVBJIEdhdGV3YXkgYW5kIHRoZSAvcHJvZHVjdHMgR0VUIGVuZHBvaW50XHJcbiAgICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhUmVzdEFwaSh0aGlzLCAnUHJvZHVjdFNlcnZpY2VBcGknLCB7XHJcbiAgICAgICAgICAgIGhhbmRsZXI6IGdldFByb2R1Y3RzTGlzdCxcclxuICAgICAgICAgICAgcHJveHk6IGZhbHNlIC8vIEVuYWJsZXMgc2V0dGluZyB1cCBpbmRpdmlkdWFsIHJvdXRlc1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBwcm9kdWN0UmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncHJvZHVjdCcpO1xyXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZVJlc291cmNlID0gcHJvZHVjdFJlc291cmNlLmFkZFJlc291cmNlKCdhdmFpbGFibGUnKTsgXHJcblxyXG4gICAgICAgIGF2YWlsYWJsZVJlc291cmNlLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oZ2V0UHJvZHVjdHNMaXN0KSwge1xyXG4gICAgICAgICAgICAvLyBTZXQgdXAgQ09SU1xyXG4gICAgICAgICAgICBtZXRob2RSZXNwb25zZXM6IFt7XHJcbiAgICAgICAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VQYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfV0sXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gRW5hYmxpbmcgQ09SU1xyXG4gICAgICAgICAgY29uc3QgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcclxuICAgICAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhdmFpbGFibGVSZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucyk7XHJcbiAgICB9XHJcbn0iXX0=