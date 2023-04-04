/**
 * Table.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const date = require("date-and-time");

module.exports = {
    attributes: {
        user: {
            model: "users",
        },
        date: {
            type: "string",
        },
        time: {
            type: "string",
        },
        guest: {
            type: "number",
        },
        ordStatus: {
            type: "string",
            defaultsTo: "pending",
            isIn: ["pending", "confirm", "cancel"],
        },

        /* {╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
         ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
         ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
         ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
         ║╣ ║║║╠╩╗║╣  ║║╚═╗
         ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
         ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
         ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
         ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝} */
    },

    checkTime: function (date1, time) {
        let msg = "ok";
        let isTime = date.isValid(time, "h:m A");
        if (!isTime) {
            return "Time is invalid";
        }

        let tParser = date.preparse(time, "h:m A");

        let newdate = Date.parse(date1 + " " + time);
        let crTime = new Date().toLocaleString();
        crTime = date.transform(
            crTime,
            "M/D/YYYY, h:m:s A",
            "D/M/YYYY, h:m:s A"
        );
        crTime = Date.parse(crTime);
        if (newdate < crTime) {
            return "Booking Time is not allowed";
        }

        date1 = date.transform(date1, "D/M/YYYY", "M/D/YYYY");
        date1 = new Date(date1);

        let day = date1.getDay();
        if (day == 0 || day == 3) {
            return "The restaurant is closed";
        } else {
            switch (day) {
                case 1:
                    if (
                        !(
                            (tParser.h >= 9 && tParser.A == 0) ||
                            (tParser.h < 9 && tParser.A == 1)
                        )
                    ) {
                        msg = "1";
                    }
                    break;

                case 2:
                    if (
                        !(
                            (tParser.h >= 9 && tParser.A == 0) ||
                            (tParser.h < 6 && tParser.A == 1)
                        )
                    ) {
                        msg = "1";
                    }
                    break;

                case 4:
                    if (
                        !(
                            (tParser.h >= 9 && tParser.A == 0) ||
                            (tParser.h < 8 && tParser.A == 1)
                        )
                    ) {
                        msg = "1";
                    }
                    break;

                case 5:
                    if (
                        !(
                            (tParser.h >= 10 && tParser.A == 0) ||
                            (tParser.h < 10 && tParser.A == 1)
                        )
                    ) {
                        msg = "1";
                    }
                    break;

                case 6:
                    if (
                        !(
                            (tParser.h >= 10 && tParser.A == 0) ||
                            (tParser.h <= 11 && tParser.A == 1)
                        )
                    ) {
                        msg = "1";
                    }
                    break;
            }
            if (msg == "1") {
                return "The Restaurant is not open";
            }
        }
        return msg;
    },

    checkDate: function (date1) {
        let msg = "ok";
        let isDate = date.isValid(date1, "D/M/YYYY");
        if (!isDate) {
            return (msg = "Date is invalid");
        }

        let tday = new Date().toLocaleDateString();
        tday = date.transform(tday, "M/D/YYYY", "D/M/YYYY");

        tday = new Date(tday);
        date1 = new Date(date1);

        if (tday > date1) {
            msg = "Date is not accepted";
        }
        return msg;
    },
};
