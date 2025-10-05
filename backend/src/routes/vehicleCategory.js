const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories } = require("../controllers/vehicleCategoryController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // temporary storage before cloud upload

// Admin adds vehicle category (image optional)
router.post("/add", upload.fields([{ name: "image", maxCount: 1 }]), addCategory);

// Get all categories
router.get("/all", getAllCategories);

module.exports = router;
