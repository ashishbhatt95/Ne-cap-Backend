const { getIO } = require("../socket");

// ✅ Send notification to a specific user
const sendNotification = (userId, role, event, data) => {
  try {
    const io = getIO();
    const room = `${role}:${userId}`;
    
    io.to(room).emit(event, {
      ...data,
      timestamp: new Date()
    });
    
    console.log(`📤 Notification sent to ${room}: ${event}`);
  } catch (error) {
    console.error("Notification send error:", error);
  }
};

// ✅ Notify admins
const notifyAdmins = (event, data) => {
  try {
    const io = getIO();
    io.to("admin-room").emit(event, {
      ...data,
      timestamp: new Date()
    });
    console.log(`📢 Admin notification: ${event}`);
  } catch (error) {
    console.error("Admin notification error:", error);
  }
};

module.exports = { sendNotification, notifyAdmins };