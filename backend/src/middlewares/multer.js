const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

// Multer storage config using CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "others";
    if (req.baseUrl.includes("vehicle")) folder = "vehicles";
    else if (req.baseUrl.includes("product")) folder = "products";
    else if (req.baseUrl.includes("vendor")) folder = "vendors";
    else if (req.baseUrl.includes("user")) folder = "users";

    // Decide allowed formats based on field
    const allowedFormats = ["jpg", "jpeg", "png"];
    let transformation = [{ width: 800, height: 800, crop: "limit" }];

    if (file.fieldname === "insurance" || file.fieldname === "pollutionCert") {
      allowedFormats.push("pdf"); // allow PDF
      transformation = []; // no image transformations
    }

    return {
      folder,
      allowed_formats: allowedFormats,
      resource_type: file.mimetype === "application/pdf" ? "raw" : "image",
      transformation,
    };
  },
});

// Multer parser ready
const parser = multer({ storage });

module.exports = parser;
