const { SignUp, Login, Refresh } = require("../controllers/AuthController");
const { useVerification } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.get("/", useVerification);
router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/refresh", Refresh);

module.exports = router;
