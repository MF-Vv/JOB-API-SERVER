const { BadRequestError } = require("../errors")

const testUser = async (req, res, next) => {
  const {
    user: { testUser },
  } = req

  if (testUser) {
    throw new BadRequestError("Test user. Read Only")
  }

  next()
}

module.exports = testUser
