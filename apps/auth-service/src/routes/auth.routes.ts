import express, { Router } from "express";
import { createNewShop, getUserProfile, loginUser, refreshToken, registerSeller, resetUserPassword, userForgotPassword, userRegistration, verifySellerOTP, verifyUser, verifyUserForgotPassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/isAuth.middleware.js";
const router:Router = express.Router()

router.post("/register-user",userRegistration)
router.post("/verify-register-user",verifyUser)
router.post("/login-user",loginUser)
router.get("/user-profile",authMiddleware,getUserProfile)
router.post("/refresh-token-user",refreshToken)
router.post("/forgot-user-password",userForgotPassword)
router.post("/reset-user-password",resetUserPassword)
router.post("/verify-forgot-password",verifyUserForgotPassword)
router.post("/seller-registration",registerSeller)
router.post("/verify-seller-registration",verifySellerOTP)
router.post("/create-seller-shop",createNewShop)


export default router