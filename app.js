require("dotenv").config()
require("express-async-errors")
const cors = require("cors")

// Security
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

// Swagger
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocs = YAML.load("./docs.yaml")

const express = require("express")
const app = express()

app.use(cors())
app.use(express.json())

// Db
const connectDB = require("./db/connect")

// Middleware
const authMiddleware = require("./middleware/authentication")
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

// Router
const authRouter = require("./route/auth-route")
const jobsRouter = require("./route/jobs-route")

app.set("trust proxy", 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each ip to 100 requests per windowMs
    message: {
      msg: "Too many request from this IP, please try again after 15 minutes",
    },
  })
)
app.use(helmet())
app.use(xss())

// Route
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authMiddleware, jobsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000
const start = async () => {
  await connectDB(process.env.MONGO_URI)
  app.listen(PORT, () => {
    console.log(`Server is listening ${PORT}`)
  })
}

start()
