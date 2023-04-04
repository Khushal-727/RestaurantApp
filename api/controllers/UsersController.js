/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = sails.config.custom.bcrypt;
const validate = sails.config.custom.validate;

module.exports = {
    signup: async function (req, res) {
        validate(req);
        const errors = await req.getValidationResult();
        if (!errors.isEmpty()) {
            return res.status(400).json({ Failed: errors.array()[0].msg });
        }

        let { userName, email, password, role, mobile, address } = req.body;
        let id = sails.config.custom.uuid;
        if (role != null) {
            if (role == "U") {
                role = "U";
            } else if (role == "A") {
                role = "A";
            } else {
                return res
                    .status(409)
                    .json({ Message: "User role is invalid1" });
            }
        }

        if (isNaN(mobile)) {
            return res.status(409).json({
                Message: "Mobile number is allow only integer, Try Again",
            });
        }

        const user1 = await Users.findOne({ email: email });
        if (user1) {
            console.log("Email Already Exists");
            return res
                .status(409)
                .json({ Message: "Email Already Exists", User: user1 });
        }

        const hashPwd = await bcrypt.hash(password, 13);
        let user = {
            id: id(),
            userName: userName,
            email: email,
            password: hashPwd,
            role: role,
            mobile: mobile,
            address: address,
        };
        let newUser = await Users.create(user).fetch();
        console.log("User is Created");

        return res.status(201).json({
            Message: "User is Created",
            Created_User: newUser,
        });
    },

    login: async function (req, res) {
        let { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(401)
                .json({ Message: "Enter email-id and password" });
        }

        const oldUser = await Users.findOne({ email: email });
        if (!oldUser) {
            console.log("Email is not Found");
            return res.status(401).json({ Message: "Email is not Found" });
        }

        const cmpPwd = await bcrypt.compare(password, oldUser.password);
        if (!cmpPwd) {
            console.log("User Password is Invalid");
            return res
                .status(401)
                .json({ Message: "User Password is Invalid" });
        }

        const token = await sails.helpers.jwt(oldUser);

        const updatedUser = await Users.updateOne({ email: email }).set({
            token: token,
        });
        if (updatedUser) {
            console.log("User Login successful");
            return res.status(200).json({
                Message: "User Login successful",
                User_id: oldUser.id,
                Token: token,
            });
        }
    },

    logout: async function (req, res) {
        let user = req.userData.userId;

        const updatedUser = await Users.updateOne({ id: user }, { token: "" });
        console.log("User Logout successful");
        return res.status(200).json({
            User_id: updatedUser.id,
            Message: "User Logout successful",
        });
    },

    listCategory: async function (req, res) {
        const category = await Category.find({ isDeleted: false })
            // .select("name")
            .sort("name");

        console.log("Show Menu");
        return res.status(200).json({
            Message: "Show Menu",
            Total: category.length,
            Category: category,
        });
    },

    listFood: async function (req, res) {
        const { id2 } = req.body;

        if (!id2) {
            return res.status(409).json({ Message: "ID is required" });
        }

        let count = 0,
            name;

        let food = await Category.findOne({
            id: id2,
            isDeleted: false,
        }).populate("food", { where: { isDeleted: false } });

        if (food) {
            name = food.name;
            food = food.food;
            count = food.length;
        }

        if (!food) {
            food = await Food.findOne({
                where: { id: id2, isDeleted: false },
                omit: ["isDeleted"],
            });

            count++;
            if (!food) {
                return res.status(200).json({
                    Message: "Id is invalid",
                    Food: food,
                });
            }
            delete food.category;
        }

        console.log("Food Detail");
        return res.status(200).json({
            Message: "Food Detail",
            CategoryName: name,
            Count: count,
            Food: food,
        });
    },
};
