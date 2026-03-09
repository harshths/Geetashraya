import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { uploadProfilePic } from "../services/storage.service.js";
dotenv.config();

const registerUser = async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  if(password.length < 6){
    return res.status(400).json({
      message: "Password must be at least 6 characters long..",
    });
  }
  let profilepic;
  if (req.file) {
    const response = await uploadProfilePic(req.file.buffer);
    profilepic = response.url;
  }

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User already exists..",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
    role,
    ...(profilepic && { profilePic: profilepic }),
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SCRT,
    { expiresIn: "10d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(201).json({
    message: "User registered successfullly...",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    },
  });
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(401).json({
      message: "Invelid credentials..",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials..",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SCRT,
    { expiresIn: "10d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax", // strict bhi problem kar sakta hai cross-origin me
  });

  res.status(200).json({
    message: "User logged in successfullly...",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    },
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully..",
  });
};

export { registerUser, loginUser, logoutUser };
