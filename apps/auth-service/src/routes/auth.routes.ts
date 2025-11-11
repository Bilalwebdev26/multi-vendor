import express, { Router } from "express";
import { loginUser, resetUserPassword, userForgotPassword, userRegistration, verifyUser, verifyUserForgotPassword } from "../controllers/auth.controller.js";
// import { userRegistration } from "../controllers/auth.controller";
// userRegistration
const router:Router = express.Router()

router.post("/register-user",userRegistration)
router.post("/verify-register-user",verifyUser)
router.post("/login-user",loginUser)
router.post("/forgot-user-password",userForgotPassword)
router.post("/reset-user-password",resetUserPassword)
router.post("/verify-forgot-password",verifyUserForgotPassword)

//email send nahi horhi----

export default router