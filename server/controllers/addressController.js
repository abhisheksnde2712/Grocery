
// Add Address : /api/address/add
import Address from "../models/Address.js";

// POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FROM MIDDLEWARE
    const { address } = req.body;

    if (!address) {
      return res.json({ success: false, message: "Address data missing" });
    }

    const newAddress = await Address.create({
      userId,
      ...address,
    });

    res.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Address : api/address/get
// GET /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

