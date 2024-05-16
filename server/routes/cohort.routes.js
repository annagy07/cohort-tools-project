const router = require("express").Router();

const Cohort = require("../models/Cohort.model");

router.get("/api/cohorts", (req, res) => {
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

router.post("/api/cohorts", (req, res) => {
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

router.get("/api/cohorts/:cohortId", (req, res) => {
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

router.put("/api/cohorts/:cohortId", (req, res) => {
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

router.delete("/api/cohorts/:cohortId", (req, res) => {
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

module.exports = router;
