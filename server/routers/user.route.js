import express from "express"
import { getUserData } from "../controllers/user.controller.js"
import verifyAuth from "../middlewares/verifyAuth.js"

const router = express.Router()

router.get("/data", verifyAuth, getUserData)


export default router