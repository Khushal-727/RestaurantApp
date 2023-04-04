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

    UsersController: {
        logout: "isLoggedIN",
    },

    CategoryController: {
        "*": ["isLoggedIN", "isAdmin"],
    },

    FoodController: {
        "*": ["isLoggedIN", "isAdmin"],
    },

    CartController: {
        "*": ["isLoggedIN", "isUser"],
    },

    OrderController: {
        "*": ["isLoggedIN", "isUser"],
    },

    FavouriteController: {
        "*": ["isLoggedIN", "isUser"],
    },

    TableController: {
        confirm: "isAdmin",
        "*": ["isLoggedIN", "isUser"],
    },
};
