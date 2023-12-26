const User = require("../models/UserModel");

module.exports.Users = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        const users = await User.find({ isAdmin: false }).skip(skip).limit(limit);
        const totalUsers = await User.countDocuments({ isAdmin: false });

        const totalPages = Math.ceil(totalUsers / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.status(200).json({
            success: true,
            users,
            pageInfo: {
                totalPages,
                currentPage: page,
                hasNextPage,
                hasPrevPage,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports.UserDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
    }
};

module.exports.DeleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const deletedUser = await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "User deleted Successfully" });
    } catch (error) {
        console.log(error);
    }
};

module.exports.UpdateUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const { email, username } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, {
            email: email,
            username: username,
        });

        res.status(200).json({ success: true, message: "User Updated Successfully", updatedUser });
    } catch (error) {
        console.log(error);
    }
};
