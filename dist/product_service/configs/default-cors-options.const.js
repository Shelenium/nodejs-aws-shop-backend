"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsMethodOptions = exports.defaultCorsPreflightOptions = void 0;
const apigateway = require("aws-cdk-lib/aws-apigateway");
exports.defaultCorsPreflightOptions = {
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowMethods: apigateway.Cors.ALL_METHODS,
};
const getCorsMethodOptions = () => ({
    methodResponses: [{
            statusCode: '200',
            responseParameters: {
                'method.response.header.Access-Control-Allow-Origin': true,
            }
        }],
});
exports.getCorsMethodOptions = getCorsMethodOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1jb3JzLW9wdGlvbnMuY29uc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJvZHVjdF9zZXJ2aWNlL2NvbmZpZ3MvZGVmYXVsdC1jb3JzLW9wdGlvbnMuY29uc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseURBQXlEO0FBRTVDLFFBQUEsMkJBQTJCLEdBQTJCO0lBQ2pFLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7SUFDekMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztDQUMxQyxDQUFDO0FBRUssTUFBTSxvQkFBb0IsR0FBbUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6RSxlQUFlLEVBQUUsQ0FBQztZQUNoQixVQUFVLEVBQUUsS0FBSztZQUNqQixrQkFBa0IsRUFBRTtnQkFDbEIsb0RBQW9ELEVBQUUsSUFBSTthQUMzRDtTQUNGLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFQVSxRQUFBLG9CQUFvQix3QkFPOUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcclxuXHJcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IGFwaWdhdGV3YXkuQ29yc09wdGlvbnMgPSB7XHJcbiAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXHJcbiAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Q29yc01ldGhvZE9wdGlvbnM6ICgpID0+IGFwaWdhdGV3YXkuTWV0aG9kT3B0aW9ucyA9ICgpID0+ICh7XHJcbiAgbWV0aG9kUmVzcG9uc2VzOiBbe1xyXG4gICAgc3RhdHVzQ29kZTogJzIwMCcsXHJcbiAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcclxuICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcclxuICAgIH1cclxuICB9XSxcclxufSk7XHJcbiJdfQ==