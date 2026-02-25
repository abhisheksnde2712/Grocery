// import User from "../models/User.js";

// // Update User CartData : /api/cart/update

// export const updateCart = async (req, res) => {
//   try {
//     const { userId, cartItems } = req.body;
//     await User.findByIdAndUpdate(userId, { cartItems });
//     res.json({ success: true, message: "Cart Updated" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, messsage: error.message });
//   }
// };




import User from "../models/User.js";

// Update User CartData : /api/cart/update
export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ FROM MIDDLEWARE
    const { cartItems } = req.body;

    if (!cartItems) {
      return res.json({ success: false, message: "Cart data missing" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
