const User = require("../db/users-schema")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, Unauthorized } = require("../errors")

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWt()

  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Email and password is required")
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new Unauthorized("Invalid credentials")
  }

  const isMatch = await user.verify(password)

  if (!isMatch) {
    throw new Unauthorized("Invalid credentials")
  }

  const token = user.createJWt()

  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  })
}

const updateUser = async (req, res) => {
  const {
    user: { userId },
    body: { name, email, lastName, location },
  } = req

  if ((!name, !email, !lastName, !location)) {
    throw new BadRequestError("Please provide all the required values")
  }

  const user = await User.findOne({
    _id: userId,
  })

  user.name = name
  user.email = email
  user.lastName = lastName
  user.location = location

  // We trigger the hooks, pre save
  const result = await user.save()

  // If no changes have been made, we can optionally choose not to send the token.
  const token = user.createJWt()
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  })
}

module.exports = {
  register,
  login,
  updateUser,
}
