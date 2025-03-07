const headers = { 
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
};

export const databaseConnectionError = {
  statusCode: 500,
  headers,
  body: JSON.stringify({ message: "Database connection fails" }),
};

export const missingDataError = {
  statusCode: 500,
  headers,
  body: JSON.stringify({ message: "Missing data for products in database" }),
};
