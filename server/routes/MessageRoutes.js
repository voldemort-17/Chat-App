import { Router} from "express"
import { getMessages, uploadFile } from "../controllers/MessageController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"

const messagesRoute = Router();

const upload = multer({dest: "uploads/files"});
messagesRoute.post("/getMessages", verifyToken, getMessages);
messagesRoute.post("/uploadFile", verifyToken, upload.single("file"), uploadFile);

export default messagesRoute;