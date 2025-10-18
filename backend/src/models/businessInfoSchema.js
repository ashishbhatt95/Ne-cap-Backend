const mongoose = require("mongoose");

const businessInfoSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      url: { type: String },
      public_id: { type: String },
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    emergencyContactNumber: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusinessInfo", businessInfoSchema);
