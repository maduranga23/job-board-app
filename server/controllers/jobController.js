const Job = require("../models/Job");

// Create a job post
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, salary, jobType } = req.body;
    const postedBy = req.user.userId; // from auth middleware

    const job = new Job({
      title,
      company,
      location,
      description,
      salary,
      jobType,
      postedBy,
    });
    await job.save();

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a job (only by owner)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = req.body;
    Object.assign(job, updates);
    await job.save();

    res.json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a job (only by owner)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// controllers/jobController.js

exports.applyJob = async (req, res) => {
  try {
    const { name, email, resumeUrl, coverLetter } = req.body;
    const jobId = req.params.jobId;
    const applicantId = req.user.userId; // From auth middleware

    // Validate input
    if (!resumeUrl) {
      return res.status(400).json({ message: "Resume URL is required" });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already applied
    const existingApplication = job.applicants.find(
      (app) => app.applicantId.toString() === applicantId
    );

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You've already applied for this job" });
    }

    // Add new application
    job.applicants.push({
      applicantId,
      name,
      email,
      resumeUrl,
      coverLetter: coverLetter || "",
    });

    await job.save();

    res.status(201).json({
      message: "Application submitted successfully!",
      jobId: job._id,
    });
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({
      message: "Failed to submit application",
      error: err.message,
    });
  }
};
