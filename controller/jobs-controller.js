const Job = require("../db/jobs-schema")
const mongoose = require("mongoose")
const moment = require("moment")
const { NotFoundError, BadRequestError } = require("../errors")
const { StatusCodes } = require("http-status-codes")

const getAllJob = async (req, res) => {
  const {
    user: { userId },
    query: { search, jobType, status, sort },
  } = req

  const queryObject = {}

  // Filter
  if (search) {
    queryObject.position = { $regex: search, $options: "i" }
  }

  if (status && status !== "all") {
    queryObject.status = status
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType
  }

  let result = Job.find(queryObject)

  // Sort
  if (sort === "latest") {
    result = result.sort("-createdAt")
  }

  if (sort === "oldest") {
    result = result.sort("createdAt")
  }

  if (sort === "a-z") {
    result = result.sort("position")
  }

  if (sort === "z-a") {
    result = result.sort("-position")
  }

  // Setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs / limit)

  res.status(200).json({
    jobs,
    totalJobs,
    numOfPages,
  })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId

  const job = await Job.create(req.body)

  res.status(StatusCodes.CREATED).json({
    job,
  })
}

const getSingleJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({ _id: jobId, createdBy: userId })

  if (!job) {
    throw new NotFoundError(`Invalid job id with ${jobId}`)
  }

  res.status(StatusCodes.OK).json({
    job,
  })
}

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  // First, find the job
  const job = await Job.findOne({ _id: jobId })

  if (!job) {
    throw new NotFoundError(`Job with ID ${jobId} not found.`)
  }

  // Check if the current user is the owner
  if (job.createdBy.toString() !== userId) {
    throw new BadRequestError("You are not authorized to delete this job.")
  }

  await job.deleteOne()

  res.status(StatusCodes.OK).json({
    status: "Success",
  })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req

  if (company === "" || position === "") {
    throw new BadRequestError("Company and position field is required")
  }

  // First, find the job
  const jobQuery = await Job.findOne({ _id: jobId })

  if (!jobQuery) {
    throw new NotFoundError(`Job with ID ${jobId} not found.`)
  }

  // Check if the current user is the owner
  if (jobQuery.createdBy.toString() !== userId) {
    throw new BadRequestError("You are not authorized to update this job.")
  }

  const job = await Job.findByIdAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  )

  if (!job) {
    throw new NotFoundError(`Invalid job id with ${jobId}`)
  }

  res.status(StatusCodes.OK).json({
    job,
  })
}

const showStats = async (req, res) => {
  const {
    user: { userId },
  } = req

  let stats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(`${userId}`),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  }

  let monthlyApplications = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(`${userId}`),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 6,
    },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item

      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM-Y")

      return {
        date,
        count,
      }
    })
    .reverse()

  res.status(StatusCodes.OK).json({
    defaultStats,
    monthlyApplications,
  })
}

module.exports = {
  getAllJob,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
}
