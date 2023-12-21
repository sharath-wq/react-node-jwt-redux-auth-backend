const { SignUp, Login } = require("../controllers/AuthController");
const { useVerification } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", useVerification);
router.post("/signup", SignUp);
router.post("/login", Login);

module.exports = router;
