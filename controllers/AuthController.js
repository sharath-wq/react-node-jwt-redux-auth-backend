const User = require("../models/UserModel");
const { createAccessToken, createRefreshToken } = require("../util/SecretTokens");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.SignUp = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const user = await User.create({
            email,
            password,
            username,
            createdAt,
        });

        const accessToken = createAccessToken(user.email, user.isAdmin);
        const refreshToken = createRefreshToken(user.email, user.isAdmin);

        res.cookie("refreshToken", refreshToken, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "User signed in successfully", success: true, user, accessToken });
        next();
    } catch (error) {
        console.log(error);
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ message: "User Not Found" });
        }

        const auth = await bcrypt.compare(password, user.password);

        if (!auth) {
            return res.json({ message: "Invalid credentials" });
        }

        const accessToken = createAccessToken(user.email, user.isAdmin);
        const refreshToken = createRefreshToken(user.email, user.isAdmin);

        res.cookie("refreshToken", refreshToken, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "User logged in successfully", success: true, accessToken });
        next();
    } catch (error) {
        console.log(error);
    }
};

module.exports.Refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;

        console.log(token);

        if (!token) {
            return res.json({ status: false });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, data) => {
            if (err) {
                return res.json({ status: false });
            } else {
                console.log(data);
                const accessToken = createAccessToken(data.email, data.isAdmin);
                res.status(201).json({ message: "New Access Token Generated", success: true, accessToken });
                next();
            }
        });
    } catch (error) {
        console.log(error);
    }
};
