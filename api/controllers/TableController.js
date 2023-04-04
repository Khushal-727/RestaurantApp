/**
 * TableController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const id = sails.config.custom.uuid;
const validate = sails.config.custom.validate;

module.exports = {
    list: async function (req, res) {
        const user = req.userData;

        const isAlready = await Table.find({
            user: user.userId,
        });

        return res.json({
            message: "List of Booked Tables",
            user: isAlready.user,
            Count: isAlready.length,
            Table: isAlready,
        });
    },

    confirm: async function (req, res) {
        const user = req.userData;
        const { table, ordStatus } = req.body;

        if (ordStatus != "confirm" && ordStatus != "cancel") {
            return res.status(400).json({ Message: "Invalid ordStatus" });
        }

        const isAlready = await Table.findOne({ id: table });

        if (!isAlready) {
            return res.json({
                message: "The tableId is not found",
            });
        } else if (isAlready.ordStatus == "confirm") {
            return res.json({
                message: "This table is already confirm.",
                Table: isAlready,
            });
        } else if (isAlready.ordStatus == "cancel") {
            return res.json({
                message: "This table is cancel. So, it can not confirm",
            });
        }

        const updatedTable = await Table.updateOne(
            { id: table },
            { ordStatus: ordStatus }
        );

        return res.status(201).json({
            Message: "Table is Confirmed",
            Table: updatedTable,
        });
    },

    track: async function (req, res) {
        const user = req.userData;
        const { table } = req.body;

        const isAlready = await Table.findOne({
            id: table,
            user: user.userId,
        });

        if (!isAlready) {
            return res.json({
                message: "The tableId is not found",
            });
        }

        return res.json({
            message: "List of Booked Tables",
            user: isAlready.user,
            Table: isAlready,
        });
    },

    book: async function (req, res) {
        const user = req.userData;
        const { guest, date, time } = req.body;

        let isDate = Table.checkDate(date);
        if (isDate != "ok") {
            return res.json({ message: isDate });
        }

        let isTime = Table.checkTime(date, time);
        if (isTime != "ok") {
            return res.json({ message: isTime });
        }

        let data = {
            id: id(),
            user: user.userId,
            date: date,
            time: time,
            guest: guest,
        };

        const booking = await Table.create(data).fetch();

        res.json({
            message: "Table Booked",
            Table: booking,
        });
    },

    cancel: async function (req, res) {
        const { table } = req.body;
        const user = req.userData;

        const isAlready = await Table.findOne({
            id: table,
            user: user.userId,
            ordStatus: "pending",
        });
        if (!isAlready) {
            return res.json({
                message: "The tableId is not found",
            });
        }

        const updatedTable = await Table.updateOne(
            {
                id: table,
                user: user.userId,
                ordStatus: "pending",
            },
            { ordStatus: "cancel" }
        );

        return res.json({
            message: "Table Details",
            Table: updatedTable,
        });
    },
};
