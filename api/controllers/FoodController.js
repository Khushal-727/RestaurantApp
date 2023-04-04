/**
 * FoodController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const id = sails.config.custom.uuid;

module.exports = {
    add: async function (req, res) {
        const { name, price, category } = req.body;
        const user = req.userData;

        let isCaterogy = await Category.findOne({
            id: category,
            isDeleted: false,
        });
        if (!isCaterogy) {
            return res.status(400).json({ Message: "Category ID is Invalid" });
        }

        let oldFood = await Food.findOne({
            name: name,
            isDeleted: false,
        }).populate("category");
        if (oldFood) {
            return res.status(201).json({
                Message: "Food is already exists",
                Data: oldFood,
            });
        }

        let newFood = await Food.create({
            id: id(),
            name: name,
            price: price,
            category: category,
        }).fetch();

        console.log("Food is Created");
        return res.status(201).json({
            Message: "Food is Created",
            Created_Data: newFood,
        });
    },

    modify: async function (req, res) {
        const { name, price } = req.body;
        const user = req.userData;

        let updatedFood = await Food.updateOne({
            name: name,
            isDeleted: false,
        }).set({ price: price });
        if (!updatedFood) {
            return res.status(409).json({ Message: "Food name is not found" });
        }

        console.log("Food is Updated");
        delete updatedFood.isDeleted;
        return res.status(201).json({
            Message: "Food is Updated",
            Data_updated: updatedFood,
        });
    },

    remove: async function (req, res) {
        const { name } = req.body;
        const user = req.userData;

        const isFood = await Food.findOne({
            name: name,
            isDeleted: false,
        });
        if (!isFood) {
            return res.status(409).json({ Message: "Food name is not found" });
        }

        let deletedFood = await Food.updateOne(
            { name: name, isDeleted: false },
            { isDeleted: true }
        );
        if (!deletedFood) {
            return res.status(409).json({ Message: "Food name is not found" });
        }

        let removeFav = await Favourite.updateOne(
            { food: deletedFood.id, isDeleted: false },
            { isDeleted: true }
        );

        let removeCart = await Cart.updateOne(
            { food: deletedFood.id, isDeleted: false },
            { isDeleted: true }
        );

        console.log("Food is Deleted");
        return res.status(201).json({
            Message: "Food is Deleted",
            Data_deleted: deletedFood,
        });
    },
};
