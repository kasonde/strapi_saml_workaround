# Strapi application

This application showcases a workaround for SAML login using Strapi. The test was done with Okta SAML but should work just fine with other SAML providers.

## Requirements

- Passport SAML [here](https://github.com/node-saml/passport-saml)
- SAML entrypoint url obtained from OneLogin/Okta/Other SAML enabled SSO providers
- SAML certificate

## How to test

- Open the `.env.example` file in the root of the project folder. You will see:

```
HOST=0.0.0.0
PORT=1337
SAML_ENTRYPOINT_URL=
SAML_CERT_PATH=
```

- Add in our SAML entry point URL after the '=' sign on the line with `SAML_ENTRYPOINT_URL`. Do not wrap the url in quotation marks
- Do the same thing for the `SAML_CERT_PATH` line. Make sure the file exists in the root of the project before beginning.
- Before you test this: If you want auto-registration to be enabled, make sure you enable this feature in the SSO settings in your Strapi admin.

## Rationale

Currently, the Strapi SSO authentication routes do not allow for authentication data to be `POST`ed to the authentication route `/admin/connect/:provider`. This is the reason for your `405 Method not allowed` response. To get around this, I imported the function responsible for handling provider logins in Strapi and simply routed post requests from `/admin/connect/:provider` to it. `:provider` denotes the provider you're using. In my case it's SAML.

- To achieve this workaround, I created an api by running `strapi generate:api <api_name>`. In this case, 'sso' and added a new controller in `./api/sso/controllers/sso.js`.
- I imported the `providerLogin` function from `strapi-admin/ee/controllers/authentication` and simply returned that same function and passed in the context from the new controller.
- Inside the `./api/sso/config/routes.json` I created a route at the top of the JSON array that routes all POST requests to `/admin/connect/:provider` to the controller inside the `sso.js` file.

## The Server.js file

There a few things to take note of here.

- I left out configurations that were not necessary to get this to work. Things like the `audience` and more.
- I used the `callbackURL` and not the `path` + `host` combination to achieve the exact same thing.
- In line `:26`, Okta returns a `profile` object without a `username` or `email`. These are a requirement for SSO to registration to work. Okta instead have a `nameID` key inside the profile object. I created the new required keys inside the profile object as seen on line 27 and 28.

## More information

- For more information regarding SSO Login with Strapi, visit [this](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#single-sign-on) page.
