const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Your username is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    refreshToken: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    imageUrl: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

userSchema.pre("save", async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 12);

        if (this.email === process.env.ADMIN_EMAIL) {
            this.isAdmin = true;
        }

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("User", userSchema);
