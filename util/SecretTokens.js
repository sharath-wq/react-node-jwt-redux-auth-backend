require("dotenv").config();
const jwt = require("jsonwebtoken");

const createAccessToken = (email, isAdmin) => {
    return jwt.sign({ email, isAdmin }, process.env.ACCESS_TOKEN_SECRET_KEY, {
        expiresIn: "10s",
    });
};

const createRefreshToken = (email, isAdmin) => {
    return jwt.sign({ email, isAdmin }, process.env.REFRESH_TOKEN_SECRET_KEY);
};

module.exports = {
    createAccessToken,
    createRefreshToken,
};
