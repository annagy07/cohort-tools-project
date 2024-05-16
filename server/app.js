const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");
const { isAuthenticated } = require("./middleware/jwt.middleware");

// Setup Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

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
require("dotenv").config();

// 👇 HANDLING ROUTES
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const cohortRouter = require("./routes/cohort.routes");
app.use("/", cohortRouter);

const studentRouter = require("./routes/student.routes");
app.use("/", studentRouter);
const userRouter = require("./routes/user.routes");
app.use("/", userRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// Set up custom error handling middleware:
app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
