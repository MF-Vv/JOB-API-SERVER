const { StatusCodes } = require("http-status-codes")

const notFound = (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    msg: "Route does not exist.",
  })
}

module.exports = notFound
