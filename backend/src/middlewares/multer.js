const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

// Multer storage config using CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Folder set karna based on route
    let folder = "others";
    if (req.baseUrl.includes("product")) folder = "products";
    else if (req.baseUrl.includes("vendor")) folder = "vendors";
    else if (req.baseUrl.includes("user")) folder = "users";

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    };
  },
});

// Multer parser ready
const parser = multer({ storage });

// Export parser
module.exports = parser;