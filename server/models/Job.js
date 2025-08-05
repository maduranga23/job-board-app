const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema(
  {
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // No space
    name: { type: String, required: true },
    email: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
  },
  { timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract"],
      default: "Full-time",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // No space
      required: true,
    }, // employer user ID
    applicants: [applicantSchema], // Array of applicants
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
