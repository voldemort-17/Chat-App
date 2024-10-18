import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, searchContacts} from "../controllers/ContactController.js"

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/getContactsForDm", verifyToken, getContactsForDMList);
contactRoutes.get("/getAllContacts", verifyToken, getAllContacts);
// authRoutes.post("/image", verifyToken, upload.single("profile-image"), addProfileImage);
// authRoutes.delete("/remove-profile-image",verifyToken, removeProfileImage);

export default contactRoutes;