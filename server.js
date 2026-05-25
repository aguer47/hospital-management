const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const doctorRoutes = require("./routes/doctors");

const { swaggerUi, swaggerSpec } = require("./swagger/swagger");
const { connectDB } = require("./config/db");
const patientRoutes = require("./routes/patients");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/patients", patientRoutes);
app.use("/doctors", doctorRoutes);

app.get("/", (req, res) => {
  res.send("Hospital Management API Running");
});

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});