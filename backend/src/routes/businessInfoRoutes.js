const express = require("express");
const router = express.Router();
const { upsertBusinessInfo, getBusinessInfo } = require("../controllers/businessInfoController");
const upload = require("../middlewares/multer");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// --- Routes ---
// Admin: Create or Update Business Info
router.post(
  "/business-info",
  roleAuthorization(["admin"]),
  upload.single("logo"),
  upsertBusinessInfo
);

// Public: Get Business Info
router.get("/business-info", getBusinessInfo);

module.exports = router;