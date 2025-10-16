const mongoose = require("mongoose");

const SuperadminSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" }
});

module.exports = mongoose.model("Superadmin", SuperadminSchema);