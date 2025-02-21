const { Unauthorized } = require("../errors")
const jwt = require("jsonwebtoken")
const User = require("../db/users-schema")

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Unauthorized("Invalid Authentication")
  }

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const testUserID = process.env.TEST_USER_ID

    const testUser = payload.userId === testUserID

    req.user = {
      userId: payload.userId,
      name: payload.name,
      testUser,
    }

    next()
  } catch (error) {
    throw new Unauthorized("Authentication invalid")
  }
}

module.exports = authMiddleware
