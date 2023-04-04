/**
 * CartController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid;

module.exports = {
    list: async function (req, res) {
        const user = req.userData;

        const isCart = await Cart.find({
            user: user.userId,
            isDeleted: false,
        })
            .omit(["user", "price"])
            .populate("food");

        if (!isCart[0]) {
            return res.status(300).json({
                Message: "The cart is empty.",
                Food: isCart.food,
            });
        }

        let MainAmt = await Cart.sum("totalAmt").where({
            user: user.userId,
            isDeleted: false,
        });

        console.log("List of items added in cart");

        return res.status(201).json({
            Message: "List of items added in cart",
            PaybleAmount: MainAmt,
            Items: isCart.length,
            Cart_Items: isCart,
        });
    },

    add: async function (req, res) {
        const { foodId } = req.body;
        const user = req.userData;

        let food;
        if (foodId != null) {
            food = await Food.findOne({ id: foodId });
            if (!food) {
                return res
                    .status(300)
                    .json({ Message: "FoodId is Invalid! Try Again" });
            }
        } else {
            return res.status(300).json({ Message: "FoodId is mandetory" });
        }

        const isCart = await Cart.findOne({
            food: foodId,
            user: user.userId,
            isDeleted: false,
        }).populate("food");
        if (isCart) {
            isCart.food.quantity = isCart.quantity;
            return res.status(300).json({
                Message: "Food item is already in cart",
                Food: isCart.food,
            });
        }

        data = {
            id: id(),
            user: user.userId,
            food: foodId,
            price: food.price,
            totalAmt: food.price,
        };

        const addedCart = await Cart.create(data).fetch();
        console.log("Item is Added in the cart");
        return res.status(201).json({
            Message: "Item is Added in the cart",
            Created_Data: addedCart,
        });
    },

    modify: async function (req, res) {
        let { foodId, quantity } = req.body;
        const user = req.userData;

        let food;
        if (foodId != null) {
            food = await Food.findOne({ id: foodId });
            if (!food) {
                return res
                    .status(300)
                    .json({ Message: "FoodId is Invalid! Try Again" });
            }
        } else {
            return res.status(300).json({ Message: "FoodId is mandetory" });
        }

        if (quantity != "" && quantity != null) {
            if (isNaN(quantity)) {
                return res.status(409).json({
                    Message: "Enter quantity in integer only, Try Again",
                });
            }
            if (quantity < 1) {
                return res.status(409).json({
                    Message: "Quantity must be greater than ZERO",
                });
            }
        } else {
            return res.status(409).json({
                Message: "Quantity is required",
            });
        }

        const isCart = await Cart.findOne({
            food: foodId,
            user: user.userId,
            isDeleted: false,
        });
        if (!isCart) {
            return res.status(300).json({
                Message: "Food item is not found in cart",
            });
        }
        quantity = parseInt(quantity);
        let amt = food.price * quantity;

        const modifiedItem = await Cart.updateOne(
            { food: foodId, isDeleted: false },
            { quantity: quantity, totalAmt: amt }
        );

        console.log("Item is updated in the cart");
        return res.status(201).json({
            Message: "Item is updated in the cart",
            Updated_Data: modifiedItem,
        });
    },

    remove: async function (req, res) {
        const { foodId } = req.body;
        const user = req.userData;

        let food;
        if (foodId != null) {
            food = await Food.findOne({ id: foodId });
            if (!food) {
                return res
                    .status(300)
                    .json({ Message: "FoodId is Invalid! Try Again" });
            }
        } else {
            return res.status(300).json({ Message: "FoodId is mandetory" });
        }

        const isCart = await Cart.findOne({
            food: foodId,
            isDeleted: false,
        });

        if (!isCart) {
            return res.status(300).json({
                Message: "Food item is not found",
            });
        }

        const deletedItem = await Cart.updateOne(
            { food: foodId, isDeleted: false, user: user.userId },
            { isDeleted: true }
        );

        console.log("Item is deleted from the cart");
        return res.status(201).json({
            Message: "Item is deleted from the cart",
            Deleted_Data: deletedItem,
        });
    },
};
