const jwt = require("jsonwebtoken");
//decode token
module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.body.userId = decoded.id;
        next();

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        });
    }
}