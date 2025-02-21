const express = require("express")
const router = express.Router()
const {
  getAllJob,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} = require("../controller/jobs-controller")
const testUser = require("../middleware/test-user")

router.route("/").get(getAllJob).post(testUser, createJob)
router.route("/stats").get(showStats)
router
  .route("/:id")
  .get(getSingleJob)
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob)

module.exports = router
