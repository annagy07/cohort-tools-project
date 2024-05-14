const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

// Setup Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
const cohorts = require("./cohorts.json");
const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5005"],
  })
);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// COHORT ROUTES

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.post("/api/cohorts", (req, res) => {
  Cohort.create({
    inProgress: req.body.inProgress,
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    format: req.body.format,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours,
  })
    .then((createdCohort) => {
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error while creating the cohort:", error);
      res.status(500).json({ error: "Failed to create cohort" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;
  Cohort.findById(cohortId)
    .then((cohort) => {
      if (!cohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.status(200).json(cohort);
    })
    .catch((error) => {
      console.error("Error while retrieving the cohort:", error);
      res.status(500).json({ error: "Failed retrieving cohort" });
    });
});

app.put("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      if (!updatedCohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.status(200).json(updatedCohort);
    })
    .catch((error) => {
      console.error("Error while updating the cohort:", error);
      res.status(500).json({ error: "Update failed" });
    });
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;
  Cohort.findByIdAndDelete(cohortId)
    .then((deletedCohort) => {
      if (!deletedCohort) {
        return res.status(404).json({ error: "Cohort not found" });
      }
      res.status(204).send(); // No content to send back
    })
    .catch((error) => {
      console.error("Error while deleting the cohort:", error);
      res.status(500).json({ error: "Failed to delete cohort" });
    });
});

// STUDENT ROUTES

app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.post("/api/students", (req, res) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    projects: req.body.projects,
    cohort: req.body.cohort,
  })
    .then((createdStudent) => {
      res.status(201).json(createdStudent);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed creating student" });
    });
});

app.get("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(200).json(student);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed retrieving student" });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const cohortId = req.params.cohortId;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((cohortStudents) => {
      res.status(200).json(cohortStudents);
    })
    .catch((error) => {
      console.error("Error while retrieving cohort students:", error);
      res.status(500).json({ error: "Error finding cohort" });
    });
});

app.put("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => {
      if (!updatedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(200).json(updatedStudent);
    })
    .catch((error) => {
      console.error("Error while updating the student:", error);
      res.status(500).json({ error: "Update failed" });
    });
});

app.delete("/api/students/:studentId", (req, res) => {
  const studentId = req.params.studentId;
  Student.findByIdAndDelete(studentId)
    .then((deletedStudent) => {
      if (!deletedStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(204).send();
    })
    .catch((error) => {
      console.error("Error while deleting the student:", error);
      res.status(500).json({ error: "Failed to delete student" });
    });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// app.get("/api/cohorts", (req, res) => {
//   try {
//     if (!cohorts) throw new Error("Cohorts data not found");
//     res.json(cohorts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
