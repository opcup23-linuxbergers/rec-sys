const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.header("authorization");
        if (!token) return res.status(403).send("Access denied.");

        const decoded = jwt.verify(token, 'shhhhh');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};