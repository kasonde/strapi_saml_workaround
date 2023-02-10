const SamlStrategy = require("passport-saml").Strategy;
const fs = require("fs");

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("SERVER_URL", "http://localhost:1337"), // this could be an ngrok url as well.
  // proxy: true,
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "0a40028cd1635f8b044343a747e83bfe"),
      providers: [
        {
          uid: "saml",
          displayName: "Okta",
          icon: "https://ok14static.oktacdn.com/assets/img/logos/okta-logo.47066819ac7db5c13f4c431b2687cef6.png",
          createStrategy: (strapi) => {
            return new SamlStrategy(
              {
                callbackURL:
                  strapi.config.server.url +
                  strapi.admin.services.passport.getStrategyCallbackURL("saml"),
                cert: fs.readFileSync(env("SAML_CERT_PATH"), "utf-8"),
                entryPoint: env("SAML_ENTRYPOINT_URL"),
                issuer: env("SAML_ISSUER"),
              },
              function (profile, done) {
                profile.username = profile.nameID;
                profile.email = profile.nameID;
                done(null, profile);
              }
            );
          },
        },
      ],
    },
  },
});
