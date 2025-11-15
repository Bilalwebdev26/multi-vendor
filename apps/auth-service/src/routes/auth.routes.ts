import express, { Router } from "express";
import { createNewShop, createStripeLink, getSeller, getUserProfile, loginUser, refreshToken, registerSeller, resetUserPassword, sellerLogin, userForgotPassword, userRegistration, verifySellerOTP, verifyUser, verifyUserForgotPassword } from "../controllers/auth.controller.js";
import { authMiddleware, isSeller, isUser, sellerAuthMiddleware } from "../middleware/isAuth.middleware.js";
const router:Router = express.Router()
//-------------------user-------------------------
router.post("/register-user",userRegistration)
router.post("/verify-register-user",verifyUser)
router.post("/login-user",loginUser)
router.get("/user-profile",authMiddleware,isUser,getUserProfile)
router.post("/refresh-token-user",refreshToken)
router.post("/forgot-user-password",userForgotPassword)
router.post("/reset-user-password",resetUserPassword)
router.post("/verify-forgot-password",verifyUserForgotPassword)
//-------------------seller-------------------------
router.post("/seller-registration",registerSeller)
router.post("/verify-seller-registration",verifySellerOTP)
router.post("/create-seller-shop",createNewShop)
router.post("/seller-login",sellerLogin)
router.get("/get-seller-profile",sellerAuthMiddleware,isSeller,getSeller)
//-------------------stripe-------------------------
router.post("/create-stripe-link",createStripeLink)

export default router