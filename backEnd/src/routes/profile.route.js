
import express from 'express';
import { updateProfile, getProfile } from '../controller/profile.controller.js';
import multer from 'multer';
import {authUser } from '../middlewares/auth.middleware.js';

const upload = multer();    

const profileRouter = express.Router();
profileRouter.put("/update",authUser, upload.single("profilePic"), updateProfile);
profileRouter.get("/get", authUser, getProfile);

export default profileRouter;