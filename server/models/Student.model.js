// ./models/Book.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
// Schema - describes and enforces the structure of the documents
const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  linkedinUrl: { type: String, default: "" },
  languages: {
    type: [String],
    enum: [
      "English",
      "Spanish",
      "French",
      "German",
      "Portuguese",
      "Dutch",
      "Other",
    ],
  },
  program: {
    type: String,
    enum: ["Web Dev", "UX/UI", "Data Analytics", "Cybersecurity"],
  },
  background: { type: String, default: "" },
  image: { type: String, default: "https://i.imgur.com/r8bo8u7.png" },
  projects: Array,
  cohort: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cohort",
  },
});

// CREATE MODEL
// The model() method defines a model (Cohort) and creates a collection (cohorts) in MongoDB
// The collection name will default to the lowercased, plural form of the model name:
const Student = mongoose.model("Student", studentSchema);

// EXPORT THE MODEL
module.exports = Student;

// cohort
// 616c4b4c649eaa001dd50f81
