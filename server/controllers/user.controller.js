import asyncHandler from "express-async-handler";
import {User} from "../models/users.model.js";


export const getUserData = asyncHandler(async (req, res) => {
    const id = req.user
    
    const user = await User.findById(id)
    if(!user) return res.json({success: false, message:"User not found"})

    res.json({
        success:true,
        userData: {
            name: user.name,
            username: user.username,
            email: user.email,
            isVerify: user.isVerify,
            otp: user.verifyToken
        }
    })
})