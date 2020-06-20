// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'gwh91co1s3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map
  domain: 'dev-3kby9y3i.auth0.com',            // Auth0 domain
  clientId: 'YurVDVidCV9B0Ce3pZRcAcP0aWgp0O27',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}