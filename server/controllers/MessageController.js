import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js"
import escapeStringRegexp from 'escape-string-regexp'; // Ensure you have this library installed
import {mkdirSync, renameSync} from "fs"

export const getMessages = async (req, res, next) => {
    try {

        const user2 = req.body.id;
        const user1 = req.userId;

        if (!user1 || !user2) {
            return res.status(400).json({ msg: "Both Users ID are required." });
        }

        const messages = await Message.find({
            $or: [
                {sender: user1, recipient: user2},
                {sender: user2, recipient: user1}
            ],
        }).sort({timestamp: 1})

        return res.status(200).json({ messages });
    } catch (error) {
        console.error('Error searching contacts:', error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const uploadFile = async (req, res, next) => {
    try {
        if(!req.file){
            return res.status(500).json({ msg: "File is required." });
        }
        const date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`

        mkdirSync(fileDir, {recursive: true});
        renameSync(req.file.path, fileName);

        return res.status(200).json({ filePath: fileName });
    } catch (error) {
        console.error('Error searching contacts:', error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};