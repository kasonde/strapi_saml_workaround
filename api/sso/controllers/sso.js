"use strict";

// Import the function responsible for handling authentication using SSO providers
const { providerLogin } = require("strapi-admin/ee/controllers/authentication");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // create a controller with whatever name you want. Return the providerLogin function and pass in the ctx as a parameter.
  ssoLogin(ctx, next) {
    return providerLogin(ctx, next);
  },
};
