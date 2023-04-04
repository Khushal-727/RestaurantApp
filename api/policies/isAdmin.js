const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (decoded.role == "A") {
            return next();
        } else {
            return res.status(401).json({
                Message: "You are User. This right is only for Admin.",
            });
        }
    } catch (err) {
        return res.status(401).json({
            Message: "Token is Invalid",
            Error: err,
        });
    }
};
