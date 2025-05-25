import express from "express"
import { isAuthenticated, login, logout, register, resetToken, sendResetToken, sendVerifyToken, verifyToken } from "../controllers/auth.controller.js"
import verifyAuth from './../middlewares/verifyAuth.js';

const router = express.Router()

router.post("/register", register) //! done
router.post("/login", login) //! done
router.post("/logout", verifyAuth, logout) //! done
router.get("/is-auth",verifyAuth, isAuthenticated) //! done
router.post("/send-verify-token",verifyAuth ,sendVerifyToken) //! done
router.post("/verify-token", verifyAuth, verifyToken) //! done
router.post("/send-reset-token", sendResetToken) //! done
router.post("/reset-token", resetToken) //! done

export default router