const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctors");
const appointmentRoutes = require("./routes/appointments");
const departmentRoutes = require("./routes/departments");
const patientRoutes = require("./routes/patients");

const { swaggerUi, swaggerSpec } = require("./swagger/swagger");
const { connectDB } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production" // Use secure cookies in production
  }
}));

// If deployed on a proxy like Render
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Auth routes first
app.use("/", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/departments", departmentRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Management API Running");
});

connectDB();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
