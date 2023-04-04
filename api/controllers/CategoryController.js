/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const id = sails.config.custom.uuid;

module.exports = {
    add: async function (req, res) {
        const { name } = req.body;
        const user = req.userData;

        let oldCategory = await Category.findOne({
            name: name,
            isDeleted: false,
        }).select("name");
        if (oldCategory) {
            return res.status(201).json({
                Message: "Category is already exists",
                Data: oldCategory,
            });
        }

        let newCategory = await Category.create({
            id: id(),
            name: name,
        }).fetch();
        console.log("Category is Created");
        return res.status(201).json({
            Message: "Category is Created",
            Created_Data: newCategory,
        });
    },

    remove: async function (req, res) {
        const { name } = req.body;
        const user = req.userData;

        const isCategory = await Category.findOne({
            name: name,
            isDeleted: false,
        });

        if (!isCategory) {
            return res
                .status(409)
                .json({ Message: "Category name is not found" });
        }

        let isUsed = await Food.find({ category: isCategory.id });
        if (isUsed[0]) {
            return res
                .status(409)
                .json({ Message: "Category name is assossiate with food" });
        }

        let deletedCategory = await Category.updateOne(
            { name: name, isDeleted: false },
            { isDeleted: true }
        );

        console.log("Category is Deleted");
        return res.status(201).json({
            Message: "Category is Deleted",
            Data_deleted: deletedCategory,
        });
    },
};
