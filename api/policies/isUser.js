const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (decoded.role == "U") {
            return next();
        } else {
            return res.status(401).json({
                Message: "You are Admin. so,This right is only for User.",
            });
        }
    } catch (err) {
        return res.status(401).json({
            Message: "Token is Invalid",
            Error: err,
        });
    }
};
