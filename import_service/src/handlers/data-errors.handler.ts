const headers = { 
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,POST, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': true,
};

export const missingBucketError = {
  statusCode: 500,
  headers,
  body: JSON.stringify({ message: "Connection with bucket failed" }),
};

export const missingNameError = {
  statusCode: 400,
  headers,
  body: JSON.stringify({
    message: 'File name is required!',
  }),
};
