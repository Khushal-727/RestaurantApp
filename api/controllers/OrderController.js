/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const id = sails.config.custom.uuid;
module.exports = {
    track: async function (req, res) {
        const { orderId } = req.body;
        const user = req.userData;
        if (!orderId) {
            return res.status(409).json({
                Message: "OrderID is required",
            });
        }

        const isOrder = await Order.findOne({
            id: orderId,
            user: user.userId,
            isDeleted: false,
        });
        if (!isOrder) {
            return res.status(300).json({ Message: "Order-ID is Invalid" });
        }

        console.log("Order Details");
        return res.status(201).json({
            Message: "Order Details",
            Order: isOrder,
        });
    },

    list: async function (req, res) {
        const user = req.userData;

        const isOrder = await Order.find({
            user: user.userId,
            isDeleted: false,
        });
        if (!isOrder[0]) {
            return res.status(300).json({ Message: "No orders are found" });
        }

        return res.status(201).json({
            Message: "List of Ordered Items",
            Count: isOrder.length,
            Order: isOrder,
        });
    },

    place: async function (req, res) {
        let { address } = req.body;
        const user = req.userData;

        const isUser = await Users.findOne({ id: user.userId });
        if (!address) {
            address = isUser.address;
        }

        const isCart = await Cart.find({
            user: user.userId,
            isDeleted: false,
        })
            .populate("food")
            .select(["food", "quantity", "totalAmt"]);
        if (!isCart[0]) {
            return res
                .status(300)
                .json({ Message: "You have no food in cart" });
        }
        let totalAmt = await Cart.sum("totalAmt").where({
            user: user.userId,
            isDeleted: false,
        });

        let data = {
            id: id(),
            user: user.userId,
            totalAmount: totalAmt,
            orderDate: new Date().toLocaleString(),
            address: address,
        };
        const newOrder = await Order.create(data).fetch();
        const deleteCart = await Cart.update(
            { user: user.userId, isDeleted: false },
            { isDeleted: true }
        );

        console.log(deleteCart);

        console.log("Order is place");
        return res.status(201).json({
            Message: "Order is place",
            PaybleAmount: totalAmt,
            Order: newOrder,
            Cart_Items: isCart,
        });
    },

    cancel: async function (req, res) {
        const { orderId } = req.body;
        const user = req.userData;

        const isOrder = await Order.findOne({
            id: orderId,
            user: user.userId,
            isDeleted: false,
        });
        if (!isOrder) {
            return res.status(300).json({ Message: "Order-ID is Invalid" });
        }

        const updatedOrder = await Order.updateOne(
            {
                id: orderId,
                user: user.userId,
                isDeleted: false,
            },
            { isDeleted: true }
        );
        console.log("Order is cancel");
        return res.status(201).json({
            Message: "Order is cancel",
            Order: updatedOrder,
        });
    },
};
