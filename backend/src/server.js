const mongoose = require("mongoose");
const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/db");
const { initSocket } = require("./socket");

// Connect to MongoDB
connectDatabase();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = initSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
