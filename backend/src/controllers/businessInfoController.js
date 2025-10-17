const BusinessInfo = require("../models/businessInfoSchema");
const { deleteImage } = require("../services/cloudinary");

//  Add or Update Business Info (only one record)
exports.upsertBusinessInfo = async (req, res) => {
  try {
    const {
      businessName,
      address,
      contactNumber,
      emergencyContactNumber,
      email,
      facebook,
      instagram,
      youtube,
    } = req.body;

    let logoData = null;
    if (req.file && req.file.path) {
      logoData = {
        url: req.file.path,
        public_id: req.file.filename || "",
      };
    }

    let businessInfo = await BusinessInfo.findOne();

    if (businessInfo) {
      // Delete old logo if new one uploaded
      if (logoData && businessInfo.logo?.public_id) {
        await deleteImage(businessInfo.logo.public_id);
      }

      businessInfo.set({
        businessName,
        address,
        contactNumber,
        emergencyContactNumber,
        email,
        facebook,
        instagram,
        youtube,
        ...(logoData && { logo: logoData }),
      });

      await businessInfo.save();
      return res
        .status(200)
        .json({ success: true, message: "Business info updated", data: businessInfo });
    } else {
      businessInfo = new BusinessInfo({
        businessName,
        address,
        contactNumber,
        emergencyContactNumber,
        email,
        facebook,
        instagram,
        youtube,
        logo: logoData,
      });
      await businessInfo.save();
      return res
        .status(201)
        .json({ success: true, message: "Business info added", data: businessInfo });
    }
  } catch (error) {
    console.error("Error in upsertBusinessInfo:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

//  Get Business Info
exports.getBusinessInfo = async (req, res) => {
  try {
    const businessInfo = await BusinessInfo.findOne();
    if (!businessInfo)
      return res.status(404).json({ success: false, message: "No business info found" });

    res.status(200).json({ success: true, data: businessInfo });
  } catch (error) {
    console.error("Error in getBusinessInfo:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
