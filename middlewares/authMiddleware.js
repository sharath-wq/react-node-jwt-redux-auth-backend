const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.useVerification = (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.json({ status: false });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false });
        } else {
            const user = await User.findOne({ email: data.email });
            if (user) return res.json({ status: true, user });
            else return res.json({ status: false });
        }
    });
};
