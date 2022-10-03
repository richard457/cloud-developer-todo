// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'k9xhniu778'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'richie.us.auth0.com',            // Auth0 domain
  clientId: '2tnYUW0rMSsxDNv7sWfsxCWaz9nHR4e2',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
