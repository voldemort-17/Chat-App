import { Router } from "express";
import { login, signUp, getUserInfo, updateProfile, logout } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"


const authRoutes = Router();
const upload = multer({dest: "uploads/profiles/"})

authRoutes.post("/signup", signUp);
authRoutes.post("/login", login);
authRoutes.get("/userinfo", verifyToken, getUserInfo);
authRoutes.post("/update", verifyToken, updateProfile);
authRoutes.post("/logout", logout);
// authRoutes.post("/image", verifyToken, upload.single("profile-image"), addProfileImage);
// authRoutes.delete("/remove-profile-image",verifyToken, removeProfileImage);

export default authRoutes;