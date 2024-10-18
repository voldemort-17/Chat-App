import { compare } from "bcrypt";
import User from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import { renameSync, unlinkSync} from "fs"


const maxAge = 3 * 24 * 60 * 60 * 10000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
} 

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Invalid Email or Password" })
        }
        const user = await User.create({ email, password });
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Invalid Email or Password" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User with given Email not found." })
        }

        const auth = await compare(password, user.password);

        if (!auth) {
            return res.status(400).json({ msg: "Incorrect Password" })
        }
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ msg: "User ID is required" });
        }

        const userData = await User.findById(req.userId);

        if (!userData) {
            return res.status(404).send("User with given ID not found");
        }

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the next middleware
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}


export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;

        if (!firstName || !lastName) return res.status(400).send("firstName, lastname and color are required");

        const userData = await User.findByIdAndUpdate(
            userId, {
            firstName, lastName, color, profileSetup: true
        },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

// export const addProfileImage = async (req, res, next) => {
//     try {
//         if(!req.file){
//             return res.status(400).send("file is required.")
//         }

//         const date = Date.now();
//         let fileName = "uploads/profiles" + date + req.file.originalname;
//         renameSync(req.file.path.fileName);

//         const updatedUser = await User.findByIdAndUpdate(req.userId, {image: fileName}, {new: true, runValidators: true})

//         return res.status(200).json({
//             image: updatedUser.image,
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ msg: "Internal Server Error" })
//     }
// }

export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if(!user){
            res.status(404).send("User not found.")
        }

        if(user.image){
            unlinkSync(user.image);
        }

        user.image = null;
        await user.save();

        return res.status(200).msg("Profile Image removed Successfully.")
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        console.log("Cookie cleared");

        return res.status(200).json({ msg: "Logout Successful." });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Internal Server Error" });
    }
}

