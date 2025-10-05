const { v2: cloudinary } = require("cloudinary");

// --- Configure Cloudinary ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Upload multiple images ---
const uploadImages = async (files, folder = "default") => {
  const uploadedImages = [];
  for (const file of files) {
    if (!file.path) continue; // safety check
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
    });
    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
      originalName: file.originalname,
    });
  }
  return uploadedImages;
};

// --- Delete image ---
const deleteImage = async (public_id) => {
  if (!public_id) throw new Error("public_id is required for deletion");
  return await cloudinary.uploader.destroy(public_id);
};

module.exports = { uploadImages, deleteImage, cloudinary };