  const AUTH_USERNAME: string = 'Shelenium';
  const AUTH_PASSWORD: string = 'TEST_PASSWORD';

  const credentials = `${AUTH_USERNAME}:${AUTH_PASSWORD}`;

  const base64Credentials = Buffer.from(credentials).toString('base64');

  console.log(`Base64-Encoded Credentials for ${AUTH_USERNAME}:${AUTH_PASSWORD}:` , base64Credentials);
