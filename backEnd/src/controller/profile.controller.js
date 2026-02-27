import userModel from "../model/user.model.js";
import { uploadProfilePic } from "../services/storage.service.js";

const updateProfile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Profile picture is required..",
    });
  }

  console.log("File:", req.file);
  console.log("User:", req.user);

  const profilePicResult = await uploadProfilePic(req.file.buffer);

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    { profilePic: profilePicResult.url },
    { new: true     }
  );

  console.log("File:", req.file);
  console.log("User:", req.user);

  console.log("Updated User:", updatedUser);

  res.status(200).json({
    message: "Profile updated successfully..",
    user: updatedUser,
  });
};

const getProfile = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "Profile fetched successfully..",
    user,
  });
};

export { updateProfile, getProfile };
