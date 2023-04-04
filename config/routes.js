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
    // User's Routes
    "POST /user/signup": "usersController.signup",
    "POST /user/login": "usersController.login",
    "POST /user/logout": "usersController.logout",

    // Category's Routes
    "GET /category/": "usersController.listCategory",
    "POST /category/": "CategoryController.add",
    "DELETE /category/": "CategoryController.remove",

    // Food's Routes
    "POST /food/list": "usersController.listFood",
    "POST /food/": "FoodController.add",
    "PATCH /food/": "FoodController.modify",
    "DELETE /food/": "FoodController.remove",

    // Cart's Routes
    "GET /cart/": "CartController.list",
    "POST /cart/": "CartController.add",
    "PATCH /cart/": "CartController.modify",
    "DELETE /cart/": "CartController.remove",

    // Order's Routes
    "GET /order/": "OrderController.list",
    "POST /order/track": "OrderController.track",
    "POST /order/": "OrderController.place",
    "DELETE /order/": "OrderController.cancel",

    // Routes for Favoutrite
    "GET /favourite/": "FavouriteController.list",
    "POST /favourite/": "FavouriteController.add",
    "DELETE /favourite/": "FavouriteController.remove",

    // Table's Routes
    "GET /table/": "TableController.list",
    "POST /table/track": "TableController.track",
    "POST /table/": "TableController.book",
    "PATCH /table/": "TableController.confirm",
    "DELETE /table/": "TableController.cancel",
};
