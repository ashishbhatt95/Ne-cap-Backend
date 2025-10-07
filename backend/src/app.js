require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passengerRoutes = require("./routes/passengerRoutes");
const swaggerDocs = require("../src/swagger/index");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const vehicleCategoryRoutes = require("./routes/vehicleCategory");

// Routes
app.use("/api/passenger", passengerRoutes);
app.use("/api/vehicle-category", vehicleCategoryRoutes);
const vehicleRoutes = require("./routes/vehicle");
app.use("/api/vehicle", vehicleRoutes);

const riderRoutes = require("./routes/riderRoutes");
app.use("/api/rider", riderRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/booking", bookingRoutes);

swaggerDocs(app);

// Root endpoint
app.get("/", (req, res) => res.send("🚖 NE Cab Backend API Running..."));

app.get("/favicon.ico", (req, res) => res.status(204));

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
