const express = require("express")
const router = express.Router()
const { register, login, updateUser } = require("../controller/auth-controller")
const authMiddleware = require("../middleware/authentication")
const testUser = require("../middleware/test-user")

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/updateUser").patch(authMiddleware, testUser, updateUser)

module.exports = router
