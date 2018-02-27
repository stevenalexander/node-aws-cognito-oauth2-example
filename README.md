# Node AWS Cognito example

Example application using [AWS Cognito](https://aws.amazon.com/cognito/) for authentication.

Requires:
* NodeJS
* AWS Cognito user pool configured for API client (see below)

## Setup AWS Cognito

You will need access to an AWS account to setup a Cognito User pool.

1. Setup Cognito user pool to be used for your users (see [here](https://docs.aws.amazon.com/cognito/latest/developerguide/setting-up-cognito-user-identity-pools.html))
2. In user pool "General settings" - "App Clients", create a client for your application (needed for config)
3. In user pool "App integration" - "App client settings",
    * check Enabled Identity providers - Cognito User Pool
    * set callback url - `http://localhost:3000/callback`
    * set sign out url - `http://localhost:3000/signout`
    * check "Allowed OAuth Flows" - "Authorization code grant"
    * check "Allowed OAuth Scopes" - email, openid, profile
4. In user pool "App integration" - "Domain name", create a domain (needed for using cognito UI via OAuth 2.0 Authorization code grant flow)

## Run

Set envs:
```
export COGNITO_APP_CLIENT_ID='YOUR_COGNITO_APP_CLIENT_ID'
export COGNITO_APP_CLIENT_SECRET='YOUR_COGNITO_APP_CLIENT_SECRET'
export COGNITO_DOMAIN='YOUR_COGNITO_DOMAIN'
export COGNITO_JWK='YOUR_COGNITO_JWK' # copy your kid referenced JWK from https://cognito-idp.{region}.amazonaws.com/{userPoolId}/.well-known/jwks.json
```

Run:
```
npm install
npm start
```

## Notes

Useful links:
* [Using tokens documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-with-identity-providers.html)
* Useful [answer](https://stackoverflow.com/questions/40302349/how-to-verify-jwt-from-aws-cognito-in-the-api-backend) on parsing JWK to pem

