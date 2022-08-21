/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },
  "POST /auth/register": "auth/register",
  "POST /auth/login": "auth/login",
  "GET /auth/list": "auth/list",
  "GET /auth/:emailToken/verify": "auth/verify",
  "GET /auth/google/url": "auth/google/url",
  "GET /auth/google/callback": "auth/google/callback",

  "GET /user/list": "user/list",
  "GET /user/me": "user/get-me",

  "GET /project/list": "project/list",
  "GET /project/:id": "project/get-by-id",
  "POST /project/create": "project/create",
  "PATCH /project/update/:id": "project/update",
  "DELETE /project/delete/:id": "project/delete",

  "GET /task/:projectId/list": "task/list",
  "POST /task/create": "task/create",
  "GET /task/:id": "task/get-by-id",
  "PATCH /task/update/:id": "task/update",
  "DELETE /task/delete/:id": "task/delete",

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
