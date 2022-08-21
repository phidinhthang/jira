/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,
  "auth/list": "isLoggedIn",

  "user/get-me": "isLoggedIn",
  "user/list": "isLoggedIn",

  "project/create": "isLoggedIn",
  "project/delete": "isLoggedIn",
  "project/update": "isLoggedIn",
  "project/list": "isLoggedIn",
  "project/get-by-id": "isLoggedIn",

  "task/create": "isLoggedIn",
  "task/delete": "isLoggedIn",
  "task/update": "isLoggedIn",
  "task/list": "isLoggedIn",
  "task/get-by-id": "isLoggedIn",
};
