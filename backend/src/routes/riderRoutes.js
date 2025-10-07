const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riderController");
const upload = require("../middlewares/multer");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

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
router.get("/", verifyToken, allowRoles("superadmin"), riderController.getAllRiders);
router.get("/:id", verifyToken, allowRoles("superadmin", "rider"), riderController.getRiderById);
router.put("/:id", verifyToken, allowRoles("rider", "superadmin"), riderController.updateRider);
router.delete("/:id", verifyToken, allowRoles("superadmin"), riderController.deleteRider);

// Admin Approve / Reject
router.put("/:id/approve", verifyToken, allowRoles("superadmin"), riderController.approveRider);
router.put("/:id/reject", verifyToken, allowRoles("superadmin"), riderController.rejectRider);

// Add Passenger Review (authenticated rider or user)
router.post("/:riderId/review", verifyToken, allowRoles("user"), riderController.addReview);

module.exports = router;
