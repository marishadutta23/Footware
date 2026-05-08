import User from "../models/User.js";

// GET profile
export const getProfile = async (req, res) => {
  res.status(200).json({
    admin: {
      fullName: req.user.fullName,
      email: req.user.email,
      phone: req.user.phone,
      profilePicture: req.user.profilePicture,
      role: req.user.role,
    },
  });
};



// UPDATE profile
// UPDATE profile
export const updateProfile = async (req, res) => {
  console.log("REQ BODY:", req.body);
  console.log("REQ FILE:", req.file); // 👈 ADD THIS LINE

  const { fullName, email, phone } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.fullName = fullName || user.fullName;
  user.email = email || user.email;
  user.phone = phone || user.phone;

  if (req.file) {
    user.profilePicture = req.file.path;
  }

  await user.save();

  res.status(200).json({
  message: "Profile updated",
  admin: user,
});

};
