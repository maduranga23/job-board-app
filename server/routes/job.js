const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  applyJob,
} = require("../controllers/jobController");

// Public route to get all jobs
router.get("/", getJobs);

// Public route to get single job
router.get("/:id", getJobById);

// Protected routes (only for logged-in employers)
router.post("/", authMiddleware, createJob);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);
router.post("/:jobId/apply", authMiddleware, applyJob);
module.exports = router;
