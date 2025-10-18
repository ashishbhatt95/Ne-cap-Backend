const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*", // Production me specific domain use karein
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // ✅ JWT Authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error("Token required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ ${socket.userRole} connected: ${socket.userId}`);

    // Auto-join personal room
    const room = `${socket.userRole}:${socket.userId}`;
    socket.join(room);
    console.log(`👤 Joined: ${room}`);

    // Admin joins admin-room
    if (socket.userRole === "admin" || socket.userRole === "vendor") {
      socket.join("admin-room");
    }

    socket.emit("connected", {
      success: true,
      message: "Connected to notification service",
      userId: socket.userId,
      role: socket.userRole
    });

    socket.on("disconnect", () => {
      console.log(`❌ ${socket.userRole} disconnected: ${socket.userId}`);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });

  console.log("🚀 Socket.IO initialized");
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };