/**
 * FavouriteController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const id = sails.config.custom.uuid;

module.exports = {
    list: async function (req, res) {
        const user = req.userData;

        let favItem = await Favourite.find({
            isDeleted: false,
            user: user.userId,
        }).populate("food");

        if (!favItem[0]) {
            return res
                .status(300)
                .json({ Message: "no item is added in favourite" });
        }
        return res
            .status(200)
            .json({ Message: "Favourite Items", Favourite: favItem });
    },
    add: async function (req, res) {
        const { foodId } = req.body;
        const user = req.userData;

        let food = await Food.findOne({ id: foodId });
        if (!food) {
            return res
                .status(300)
                .json({ Message: "FoodId is Invalid! Try Again" });
        }
        let isAlready = await Favourite.findOne({
            food: foodId,
            isDeleted: false,
            user: user.userId,
        });

        if (isAlready) {
            return res.status(300).json({
                Message: "Food is already added in favourite",
                Favourite: isAlready,
            });
        }

        let data = {
            id: id(),
            food: foodId,
            user: user.userId,
            date: new Date().toLocaleString(),
        };
        console.log("Item is added in Favourite");
        const fav = await Favourite.create(data).fetch();
        res.status(200).json({
            Message: "Item is added in Favourite",
            Favourite: fav,
        });
    },

    remove: async function (req, res) {
        const { foodId } = req.body;
        const user = req.userData;

        let food = await Food.findOne({ id: foodId });
        if (!food) {
            return res
                .status(300)
                .json({ Message: "FoodId is Invalid! Try Again" });
        }

        let isAlready = await Favourite.findOne({
            food: foodId,
            isDeleted: false,
            user: user.userId,
        });
        if (!isAlready) {
            return res.status(300).json({
                Message: "Food item is not found in favourite",
            });
        }

        let deletedFav = await Favourite.updateOne(
            { food: foodId, isDeleted: false, user: user.userId },
            { isDeleted: true }
        );

        console.log("items is removed from Favourite");
        res.status(200).json({
            Message: "Item is removed from Favourite",
            deleted_Data: deletedFav,
        });
    },
};
