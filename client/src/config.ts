// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'likvnb6h4b'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ko37epm3.eu.auth0.com',            // Auth0 domain
  clientId: '73HQdeNKgiwR7aWdrp0U0g710VfkCH7f',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
