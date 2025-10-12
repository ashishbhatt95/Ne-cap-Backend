const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riderController");
const upload = require("../middlewares/multer");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// OTP & Registration (public)
router.post(
  "/register",
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  riderController.registerRider
);
router.post("/verify-otp", riderController.verifyRiderOtp);
router.post("/resend-otp", riderController.resendOtp);

// CRUD Operations (protected)
router.get("/", roleAuthorization(["superadmin"]), riderController.getAllRiders);
router.get("/:id", roleAuthorization(["superadmin", "rider"]), riderController.getRiderById);
router.put("/:id", roleAuthorization(["rider", "superadmin"]), riderController.updateRider);
router.delete("/:id", roleAuthorization(["superadmin"]), riderController.deleteRider);

// Admin Approve / Reject
router.put("/:id/approve", roleAuthorization(["superadmin"]), riderController.approveRider);
router.put("/:id/reject", roleAuthorization(["superadmin"]), riderController.rejectRider);

// Add Passenger Review
router.post("/:riderId/review", roleAuthorization(["user"]), riderController.addReview);

module.exports = router;
