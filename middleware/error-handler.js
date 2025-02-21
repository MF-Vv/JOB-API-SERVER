const { StatusCodes } = require("http-status-codes")

const errorHandler = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong, please try again",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  }

  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST
    if (Object.values(err.errors).length > 1) {
      customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ")
    } else {
      customError.msg = Object.values(err.errors).map((item) => item.message)[0]
    }
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
  }

  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.BAD_REQUEST
    customError.msg = `Invalid job id ${err.value}`
  }

  return res.status(customError.statusCode).json({
    msg: customError.msg,
  })
}

module.exports = errorHandler
