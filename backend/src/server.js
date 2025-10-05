// server.js
const mongoose = require("mongoose");
const app = require("./app");
const connectDatabase = require("./config/db");

// Connect to MongoDB
connectDatabase();

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));