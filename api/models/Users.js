/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        userName: {
            type: "string",
            required: true,
        },
        email: {
            type: "string",
            isEmail: true,
            required: true,
        },
        role: {
            type: "string",
            defaultsTo: "U",
            isIn: ["U", "A"],
        },
        password: {
            type: "string",
            minLength: 8,
            required: true,
        },
        mobile: {
            type: "number",
        },
        address: {
            type: "string",
        },
        token: {
            type: "string",
        },

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    },

    validate: function (req) {
        req.check("userName").exists().withMessage("User Name is require");
        req.check("email").exists().withMessage("Email is require");
        req.check("email").exists().isEmail().withMessage("Enter valid Email");
        req.check("password").exists().withMessage("Password is require");
        req.check("password")
            .exists()
            .isLength({ min: 8 })
            .withMessage("Password length is weak, Enter minimum 8 characters");
        req.check("mobile").exists().withMessage("Enter mobile number");
        req.check("mobile")
            .exists()
            .isLength({ min: 10, max: 10 })
            .withMessage("Invalid length of mobile number");
        req.check("address").exists().withMessage("Address is required");
    },
};
