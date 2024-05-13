const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./cohorts.json");
const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
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
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.get("/api/cohorts", (req, res) => {
  try {
    if (!cohorts) throw new Error("Cohorts data not found");
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/students", (req, res) => {
  try {
    if (!students) throw new Error("Students data not found");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.post("/api/cohorts", (req, res) => {
//   try {
//     const newCohort = req.body;  // Get the cohort data from the request body
//     if (!newCohort._id || !newCohort.cohortName) {  // Basic validation
//       throw new Error("Missing required cohort details");
//     }
//     cohorts.push(newCohort);  // Add the new cohort to the array
//     res.status(201).json(newCohort);  // Send the newly added cohort back with 201 Created status
//   } catch (error) {
//     res.status(400).json({ message: error.message });  // Send error message if something goes wrong
//   }
// });

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
