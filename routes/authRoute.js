const { SignUp, Login, Refresh, Profile } = require("../controllers/AuthController");
const { useVerification } = require("../middlewares/authMiddleware");
const { cloudinary, handleUpload } = require("../config/cloudinaryConfing");
const User = require("../models/UserModel");

const router = require("express").Router();

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", useVerification);
router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/refresh", Refresh);
router.get("/profile/:id", Profile);

router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);

        const user = await User.findByIdAndUpdate(
            req.body.id,
            {
                imageUrl: cldRes.url,
            },
            { new: true }
        );

        return res.status(201).send({ message: "Image uploaded successfully!", user });
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).send("Error uploading image.");
    }
});

module.exports = router;
