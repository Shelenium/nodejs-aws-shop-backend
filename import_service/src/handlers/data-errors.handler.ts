const headers = { 
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
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
