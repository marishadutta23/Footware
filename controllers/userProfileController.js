import User from "../models/User.js";
export const getUserProfile = async (req, res) => {
  console.log("PROFILE API HIT");
  console.log("REQ.USER:", req.user);

  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,        // ✅ ADD
      gender: user.gender, 
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  const { fullName, phone, address, gender } = req.body;

  const user = await User.findById(req.user._id);
  

  user.fullName = fullName || user.fullName;
user.phone = phone || user.phone;
user.address = address || user.address;
user.gender = gender || user.gender;

  if (req.file) {
    user.profilePicture = req.file.path;
  }

  await user.save();

  res.status(200).json({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,        // ✅ ADD
  gender: user.gender,
    profilePicture: user.profilePicture,
  });
};
