const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/vehicleCategoryController");
const multer = require("multer");

// Multer setup (temporary storage for upload before Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add vehicle category (Admin)
router.post("/add", upload.fields([{ name: "image", maxCount: 1 }]), addCategory);

// Get all categories
router.get("/", getAllCategories);

// Get category by ID
router.get("/:id", getCategoryById);

// Update category
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), updateCategory);

// Delete category
router.delete("/:id", deleteCategory);

module.exports = router;
