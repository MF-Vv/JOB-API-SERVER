const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company is required"],
      maxLength: 50,
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      maxLength: 50,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Created by user is required"],
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
      trim: true,
    },
    jobLocation: {
      type: String,
      default: "my-city",
      required: [true, "Job location is required"],
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Jobs", JobSchema, "Jobs")
