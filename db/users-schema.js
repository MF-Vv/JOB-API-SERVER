const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Valid email is required",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 6,
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
    default: "my city",
  },
})

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWt = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.verify = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password)
  return isMatch
}

module.exports = mongoose.model("Users", UserSchema, "Users")
