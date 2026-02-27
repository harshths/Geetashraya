import express from 'express';
import { loginUser, registerUser, logoutUser} from '../controller/auth.controller.js';
import multer from 'multer';

const upload = multer();    

const authRouter = express.Router();

authRouter.post("/register", upload.single("profilepic"),     registerUser)

authRouter.post("/login", loginUser)

authRouter.post("/logout", logoutUser)



export default authRouter;